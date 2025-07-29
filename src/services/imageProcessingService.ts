/**
 * Service de traitement d'images pour l'extraction OCR des textes juridiques algériens
 * Implémente l'Algorithme 1 : Détection lignes, suppression bordures, segmentation zones
 */

export interface DetectedLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'horizontal' | 'vertical';
  confidence: number;
}

export interface PageRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'text' | 'table' | 'header' | 'footer';
  confidence: number;
}

export interface TableRegion extends PageRegion {
  type: 'table';
  cells: CellRegion[][];
  headers?: string[];
}

export interface CellRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  colspan: number;
  rowspan: number;
}

export interface ProcessedPage {
  pageNumber: number;
  width: number;
  height: number;
  horizontalLines: DetectedLine[];
  verticalLines: DetectedLine[];
  separatorLines: DetectedLine[];
  borderRegion: {
    contentX: number;
    contentY: number;
    contentWidth: number;
    contentHeight: number;
  };
  textRegions: PageRegion[];
  tableRegions: TableRegion[];
  processingTime: number;
}

class ImageProcessingService {
  private readonly BORDER_CONFIG = {
    topLines: 3,
    bottomLines: 2,
    sideLines: 2,
    tolerance: 10 // pixels de tolérance pour la détection
  };

  private readonly LINE_DETECTION_CONFIG = {
    minLineLength: 50,
    maxLineGap: 5,
    threshold: 100,
    dilationKernel: 3,
    erosionKernel: 2
  };

  /**
   * Algorithme 1 : Traitement complet d'une page PDF
   * Étapes 1-16 de l'annexe
   */
  async processPage(imageData: ImageData, pageNumber: number): Promise<ProcessedPage> {

    const startTime = performance.now();

    const result: ProcessedPage = {
      pageNumber,
      width: imageData.width,
      height: imageData.height,
      horizontalLines: [],
      verticalLines: [],
      separatorLines: [],
      borderRegion: {
        contentX: 0,
        contentY: 0,
        contentWidth: imageData.width,
        contentHeight: imageData.height
      },
      textRegions: [],
      tableRegions: [],
      processingTime: 0
    };

    try {
      // Étape 2-3 : Détecter lignes horizontales et verticales

      const { horizontal, vertical } = await this.detectLines(imageData);
      result.horizontalLines = horizontal;
      result.verticalLines = vertical;

      // Étape 4 : Enlever les bordures

      result.borderRegion = this.removeBorders(horizontal, vertical, imageData.width, imageData.height);

      // Étape 5 : Détecter lignes verticales séparatrices de texte

      result.separatorLines = this.detectTextSeparators(vertical, result.borderRegion);

      // Étape 6 : Détecter les tables (intersection lignes)

      result.tableRegions = this.detectTables(horizontal, vertical, result.borderRegion);

      // Étape 7-15 : Extraire rectangles pour zones texte et tables

      result.textRegions = this.extractTextRegions(
        result.separatorLines,
        result.tableRegions,
        result.borderRegion
      );

      // Traitement des tables avec gestion "implicit rows"
      result.tableRegions = await this.processTablesWithImplicitRows(result.tableRegions);

      result.processingTime = performance.now() - startTime;

      return result;

    } catch (error) {
      console.error(`❌ Error processing page ${pageNumber}:`, error);
      result.processingTime = performance.now() - startTime;
      return result;
    }
  }

  /**
   * Détection des lignes horizontales et verticales (Étapes 2-3)
   * Utilise dilatation/érosion pour améliorer la détection
   */
  private async detectLines(imageData: ImageData): Promise<{
    horizontal: DetectedLine[];
    vertical: DetectedLine[];
  }> {
    const lines = { horizontal: [], vertical: [] };

    try {
      // Simulation de dilatation/érosion pour améliorer détection
      const processedData = this.applyMorphologicalOperations(imageData);

      // Simulation de HoughLinesP pour détecter les lignes
      const detectedLines = this.simulateHoughLines(processedData);

      // Classifier les lignes en horizontales et verticales
      for (const line of detectedLines) {
        const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * 180 / Math.PI;
        const absAngle = Math.abs(angle);

        if (absAngle < 10 || absAngle > 170) {
          // Ligne horizontale (angle proche de 0° ou 180°)
          lines.horizontal.push({
            ...line,
            type: 'horizontal',
            confidence: this.calculateLineConfidence(line, 'horizontal')
          });
        } else if (absAngle > 80 && absAngle < 100) {
          // Ligne verticale (angle proche de 90°)
          lines.vertical.push({
            ...line,
            type: 'vertical',
            confidence: this.calculateLineConfidence(line, 'vertical')
          });
        }
      }

      return lines;

    } catch (error) {
      console.error('❌ Error in line detection:', error);
      return lines;
    }
  }

  /**
   * Suppression des bordures (Étape 4)
   * Basé sur l'analyse visuelle : 3 lignes haut, 2 bas, 2 côtés
   */
  private removeBorders(
    horizontal: DetectedLine[],
    vertical: DetectedLine[],
    pageWidth: number,
    pageHeight: number
  ): { contentX: number; contentY: number; contentWidth: number; contentHeight: number } {
    
    const tolerance = this.BORDER_CONFIG.tolerance;
    
    // Identifier les bordures du haut (3 lignes)
    const topBorders = horizontal
      .filter(line => line.y1 < pageHeight * 0.2)
      .sort((a, b) => a.y1 - b.y1)
      .slice(0, this.BORDER_CONFIG.topLines);

    // Identifier les bordures du bas (2 lignes)
    const bottomBorders = horizontal
      .filter(line => line.y1 > pageHeight * 0.8)
      .sort((a, b) => b.y1 - a.y1)
      .slice(0, this.BORDER_CONFIG.bottomLines);

    // Identifier les bordures des côtés (2 lignes de chaque côté)
    const leftBorders = vertical
      .filter(line => line.x1 < pageWidth * 0.2)
      .sort((a, b) => a.x1 - b.x1)
      .slice(0, this.BORDER_CONFIG.sideLines);

    const rightBorders = vertical
      .filter(line => line.x1 > pageWidth * 0.8)
      .sort((a, b) => b.x1 - a.x1)
      .slice(0, this.BORDER_CONFIG.sideLines);

    // Calculer la zone de contenu en excluant les bordures
    const contentX = leftBorders.length > 0 
      ? Math.max(...leftBorders.map(l => l.x1)) + tolerance 
      : tolerance;
    
    const contentY = topBorders.length > 0 
      ? Math.max(...topBorders.map(l => l.y1)) + tolerance 
      : tolerance;
    
    const contentWidth = (rightBorders.length > 0 
      ? Math.min(...rightBorders.map(l => l.x1)) 
      : pageWidth) - contentX - tolerance;
    
    const contentHeight = (bottomBorders.length > 0 
      ? Math.min(...bottomBorders.map(l => l.y1)) 
      : pageHeight) - contentY - tolerance;

    return { contentX, contentY, contentWidth, contentHeight };
  }

  /**
   * Détection des lignes verticales séparatrices de texte (Étape 5)
   * Filtrage selon les critères de l'annexe
   */
  private detectTextSeparators(
    verticalLines: DetectedLine[],
    contentRegion: { contentX: number; contentY: number; contentWidth: number; contentHeight: number }
  ): DetectedLine[] {
    const separators: DetectedLine[] = [];
    const centerX = contentRegion.contentX + contentRegion.contentWidth / 2;
    const tolerance = 50; // Marge d'erreur ε pour le centre

    for (const line of verticalLines) {
      // Vérifier si la ligne est dans la zone de contenu
      if (line.x1 < contentRegion.contentX || line.x1 > contentRegion.contentX + contentRegion.contentWidth) {
        continue;
      }

      // Vérifier si la ligne est proche du centre (avec tolérance)
      if (Math.abs(line.x1 - centerX) <= tolerance) {
        // Vérifier que la ligne ne croise pas de lignes horizontales (éviter tables)
        const intersectsTable = this.checkLineIntersection(line, verticalLines);
        
        if (!intersectsTable) {
          separators.push(line);
        }
      }
    }

    return separators;
  }

  /**
   * Détection des tables (Étape 6)
   * Intersection des lignes horizontales et verticales
   */
  private detectTables(
    horizontal: DetectedLine[],
    vertical: DetectedLine[],
    contentRegion: { contentX: number; contentY: number; contentWidth: number; contentHeight: number }
  ): TableRegion[] {
    const tables: TableRegion[] = [];
    const intersections = this.findLineIntersections(horizontal, vertical);

    // Grouper les intersections pour former des rectangles (tables)
    const tableRectangles = this.groupIntersectionsIntoTables(intersections, contentRegion);

    for (const rect of tableRectangles) {
      const table: TableRegion = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        type: 'table',
        confidence: 0.8, // À ajuster selon la qualité de détection
        cells: this.detectTableCells(rect, horizontal, vertical)
      };

      tables.push(table);
    }

    return tables;
  }

  /**
   * Extraction des zones de texte (Étapes 7-15)
   */
  private extractTextRegions(
    separatorLines: DetectedLine[],
    tableRegions: TableRegion[],
    contentRegion: { contentX: number; contentY: number; contentWidth: number; contentHeight: number }
  ): PageRegion[] {
    const textRegions: PageRegion[] = [];

    // Créer des colonnes basées sur les lignes séparatrices
    const columns = this.createColumnRegions(separatorLines, contentRegion);

    for (const column of columns) {
      // Exclure les zones occupées par les tables
      const availableRegions = this.subtractTableRegions(column, tableRegions);

      for (const region of availableRegions) {
        if (region.width > 50 && region.height > 20) { // Filtrer les régions trop petites
          textRegions.push({
            ...region,
            type: 'text',
            confidence: 0.9
          });
        }
      }
    }

    return textRegions;
  }

  /**
   * Traitement des tables avec gestion des "implicit rows"
   * Étapes 11-15 de l'algorithme
   */
  private async processTablesWithImplicitRows(tables: TableRegion[]): Promise<TableRegion[]> {
    const processedTables: TableRegion[] = [];

    for (const table of tables) {

      // Redessiner les lignes pour créer une grille complète
      const completeGrid = this.redrawTableGrid(table);

      // Détecter les cellules avec la grille complète
      const completeCells = this.detectCompleteCells(completeGrid);

      // Correspondance et fusion avec les cellules originales
      const mappedCells = this.mapAndMergeCells(table.cells, completeCells);

      processedTables.push({
        ...table,
        cells: mappedCells
      });
    }

    return processedTables;
  }

  // Méthodes utilitaires privées

  private applyMorphologicalOperations(imageData: ImageData): ImageData {
    // Simulation de dilatation/érosion pour améliorer la détection des lignes
    // En réalité, ceci devrait utiliser des opérations morphologiques sur l'image

    return imageData; // Placeholder - implémentation simplifiée
  }

  private simulateHoughLines(imageData: ImageData): DetectedLine[] {
    // Simulation de HoughLinesP d'OpenCV
    // En réalité, ceci devrait analyser l'image pour détecter les lignes

    // Placeholder - génération de lignes d'exemple pour la démonstration
    return [
      { x1: 50, y1: 100, x2: 500, y2: 100, type: 'horizontal', confidence: 0.9 },
      { x1: 50, y1: 200, x2: 500, y2: 200, type: 'horizontal', confidence: 0.8 },
      { x1: 100, y1: 50, x2: 100, y2: 400, type: 'vertical', confidence: 0.9 }
    ];
  }

  private calculateLineConfidence(line: DetectedLine, type: 'horizontal' | 'vertical'): number {
    // Calculer la confiance basée sur la longueur et la rectitude de la ligne
    const length = Math.sqrt(
      Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2)
    );
    
    return Math.min(1.0, length / 200); // Normaliser selon la longueur
  }

  private checkLineIntersection(line: DetectedLine, otherLines: DetectedLine[]): boolean {
    // Vérifier si une ligne croise d'autres lignes (indicateur de table)
    // Implémentation simplifiée
    return false;
  }

  private findLineIntersections(horizontal: DetectedLine[], vertical: DetectedLine[]): Array<{x: number, y: number}> {
    // Trouver les intersections entre lignes horizontales et verticales
    const intersections = [];
    // Implémentation simplifiée
    return intersections;
  }

  private groupIntersectionsIntoTables(intersections: Array<{x: number, y: number}>, contentRegion: any): Array<{x: number, y: number, width: number, height: number}> {
    // Grouper les intersections pour former des rectangles de tables
    // Implémentation simplifiée
    return [];
  }

  private detectTableCells(tableRect: any, horizontal: DetectedLine[], vertical: DetectedLine[]): CellRegion[][] {
    // Détecter les cellules individuelles dans une table
    // Implémentation simplifiée
    return [[]];
  }

  private createColumnRegions(separatorLines: DetectedLine[], contentRegion: any): PageRegion[] {
    // Créer des régions de colonnes basées sur les lignes séparatrices
    // Implémentation simplifiée
    return [];
  }

  private subtractTableRegions(column: PageRegion, tables: TableRegion[]): PageRegion[] {
    // Soustraire les zones de tables des colonnes pour obtenir les zones de texte
    // Implémentation simplifiée
    return [column];
  }

  private redrawTableGrid(table: TableRegion): any {
    // Redessiner les lignes pour créer une grille complète (gestion implicit rows)

    return table;
  }

  private detectCompleteCells(grid: any): CellRegion[][] {
    // Détecter les cellules avec la grille complète
    return [[]];
  }

  private mapAndMergeCells(originalCells: CellRegion[][], completeCells: CellRegion[][]): CellRegion[][] {
    // Mapper et fusionner les cellules originales avec les cellules complètes
    return originalCells;
  }
}

export const imageProcessingService = new ImageProcessingService();