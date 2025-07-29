/**
 * Service d'analyse des relations juridiques pour les textes algériens
 * Détecte les 7 types de liens entre publications légales selon l'annexe
 */

export interface LegalRelationship {
  type: 'vu' | 'modification' | 'abrogation' | 'approbation' | 'controle' | 'extension' | 'annexe';
  sourceDocument: LegalDocumentRef;
  targetDocument: LegalDocumentRef;
  description: string;
  confidence: number;
  textPosition: {
    startIndex: number;
    endIndex: number;
    page?: number;
  };
  details?: {
    articlesAffected?: string[];
    partialAbrogation?: boolean;
    extensionDomain?: string;
    conformityLevel?: 'constitutional' | 'legal' | 'regulatory';
  };
}

export interface LegalDocumentRef {
  type: string; // loi, décret, arrêté, etc.
  number: string;
  date?: {
    gregorian?: string;
    hijri?: string;
  };
  title?: string;
  issuingAuthority?: string;
}

export interface RelationshipGraph {
  documents: Map<string, LegalDocumentRef>;
  relationships: LegalRelationship[];
  clusters: DocumentCluster[];
}

export interface DocumentCluster {
  id: string;
  documents: string[];
  type: 'thematic' | 'chronological' | 'hierarchical';
  description: string;
}

class LegalRelationshipService {
  private readonly relationshipPatterns = {
    // 1. Liens "Vu" - Références à autres publications
    vu: [
      /\bvu\s+la\s+(loi|ordonnance|décret|arrêté|décision|circulaire|instruction)\s+n[°]\s*([\d\-/]+)[^;]*/gi,
      /\bvu\s+le\s+(code|décret\s+législatif|décret\s+présidentiel|décret\s+exécutif)\s+n[°]\s*([\d\-/]+)[^;]*/gi,
      /\bvu\s+l'?(arrêté|instruction|décision)\s+(?:ministériel[le]?|interministériel[le]?)?\s*n[°]\s*([\d\-/]+)[^;]*/gi
    ],

    // 2. Modifications législatives
    modification: [
      /\bmodifi[eé]\s+(?:et\s+complét[eé]\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi,
      /\bmodification\s+(?:de\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi,
      /\b(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)\s+(?:est\s+)?modifi[eé][es]?/gi
    ],

    // 3. Abrogations et annulations (partielles ou totales)
    abrogation: [
      /\babrog[eé][es]?\s+(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi,
      /\b(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)\s+(?:est\s+)?abrog[eé][es]?/gi,
      /\bannul[eé][es]?\s+(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi,
      /\babrog[eé][es]?\s+(?:les?\s+)?(?:articles?\s+)?([\d,\s\-et]+)\s+(?:de\s+)?(?:la|le|l')\s*(loi|décret|arrêté)\s+n[°]\s*([\d\-/]+)/gi
    ],

    // 4. Approbations et endorsements
    approbation: [
      /\bapprouv[eé][es]?\s+(?:par\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi,
      /\b(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)\s+approuv[eé][es]?/gi,
      /\bendoss[eé][es]?\s+(?:par\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi
    ],

    // 5. Contrôle de conformité et constitutionnalité
    controle: [
      /\bcontrôle\s+de\s+(?:conformité|constitutionnalité)\s+(?:de\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi,
      /\bconforme?\s+(?:à\s+)?(?:la\s+)?constitution[^,.]*/gi,
      /\bévaluation\s+constitutionnel[le]?\s+(?:de\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi
    ],

    // 6. Extensions et applications
    extension: [
      /\bétend[ue]?\s+(?:à|aux?)\s+[^.]*/gi,
      /\bapplicable?\s+(?:à|aux?)\s+[^.]*/gi,
      /\bapplication\s+(?:de\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)\s+(?:à|aux?)\s+[^.]*/gi,
      /\bélargissement\s+(?:de\s+la\s+)?portée\s+(?:de\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi
    ],

    // 7. Annexes et listes complémentaires
    annexe: [
      /\bannexe[s]?\s+(?:à\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi,
      /\bliste[s]?\s+(?:complémentaire[s]?\s+)?(?:à\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi,
      /\bclassification[s]?\s+(?:de\s+)?(?:la|le|l')\s*(loi|décret|arrêté|ordonnance)\s+n[°]\s*([\d\-/]+)/gi
    ]
  };

  private readonly datePatterns = {
    gregorian: /(\d{1,2})\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/gi,
    hijri: /(\d{1,2})\s+(?:moharram|safar|rabi'\s*(?:el\s+)?(?:aouel|ethani)|joumada\s+(?:el\s+)?(?:oula|ethania)|rajab|cha'bane?|ramadhan|chaoual|dhou\s+el\s+(?:kaada|hidja))\s+(\d{3,4})/gi,
    correspondance: /correspondant\s+(?:au\s+)?(\d{1,2})\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/gi
  };

  private readonly institutionPatterns = [
    /(?:ministère|minister)\s+(?:de\s+(?:la\s+|l'|du\s+|des\s+)?)?([^,.;]+)/gi,
    /(?:président|présidence)\s+de\s+la\s+république/gi,
    /premier\s+ministre/gi,
    /assemblée\s+populaire\s+nationale/gi,
    /conseil\s+(?:constitutionnel|d'?état|des\s+ministres)/gi,
    /autorité\s+(?:nationale\s+)?(?:[^,.;]+)/gi
  ];

  /**
   * Analyse le texte pour extraire toutes les relations juridiques
   */
  async analyzeRelationships(text: string, sourceDocument?: LegalDocumentRef): Promise<LegalRelationship[]> {

    const relationships: LegalRelationship[] = [];

    try {
      // Analyser chaque type de relation
      for (const [relationType, patterns] of Object.entries(this.relationshipPatterns)) {

        const foundRelationships = await this.extractRelationshipsByType(
          text, 
          relationType as keyof typeof this.relationshipPatterns, 
          patterns,
          sourceDocument
        );
        
        relationships.push(...foundRelationships);
      }

      // Trier par position dans le texte
      relationships.sort((a, b) => a.textPosition.startIndex - b.textPosition.startIndex);

      return relationships;

    } catch (error) {
      console.error('❌ Error in relationship analysis:', error);
      return relationships;
    }
  }

  /**
   * Construit un graphe de relations entre les documents
   */
  async buildRelationshipGraph(relationships: LegalRelationship[]): Promise<RelationshipGraph> {

    const documents = new Map<string, LegalDocumentRef>();
    const clusters: DocumentCluster[] = [];

    // Collecter tous les documents uniques
    for (const rel of relationships) {
      const sourceKey = this.getDocumentKey(rel.sourceDocument);
      const targetKey = this.getDocumentKey(rel.targetDocument);
      
      documents.set(sourceKey, rel.sourceDocument);
      documents.set(targetKey, rel.targetDocument);
    }

    // Créer des clusters thématiques
    const thematicClusters = this.createThematicClusters(relationships);
    clusters.push(...thematicClusters);

    // Créer des clusters chronologiques
    const chronologicalClusters = this.createChronologicalClusters(Array.from(documents.values()));
    clusters.push(...chronologicalClusters);

    const graph: RelationshipGraph = {
      documents,
      relationships,
      clusters
    };

    return graph;
  }

  /**
   * Extrait les relations d'un type spécifique
   */
  private async extractRelationshipsByType(
    text: string,
    type: keyof typeof this.relationshipPatterns,
    patterns: RegExp[],
    sourceDocument?: LegalDocumentRef
  ): Promise<LegalRelationship[]> {
    const relationships: LegalRelationship[] = [];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        try {
          const relationship = this.parseRelationshipMatch(match, type, text, sourceDocument);
          if (relationship) {
            relationships.push(relationship);
          }
        } catch (error) {
          console.warn(`⚠️ Error parsing ${type} relationship:`, error);
        }
      }
    }

    return relationships;
  }

  /**
   * Parse une correspondance regex en relation juridique
   */
  private parseRelationshipMatch(
    match: RegExpExecArray,
    type: keyof typeof this.relationshipPatterns,
    fullText: string,
    sourceDocument?: LegalDocumentRef
  ): LegalRelationship | null {
    
    const matchText = match[0];
    const startIndex = match.index || 0;
    const endIndex = startIndex + matchText.length;

    // Extraire les informations du document cible
    const targetDocument = this.extractDocumentInfo(match, fullText);
    if (!targetDocument) {
      return null;
    }

    // Calculer la confiance basée sur la spécificité du pattern
    const confidence = this.calculateRelationshipConfidence(match, type);

    // Extraire des détails spécifiques selon le type
    const details = this.extractRelationshipDetails(matchText, type, fullText);

    const relationship: LegalRelationship = {
      type,
      sourceDocument: sourceDocument || { type: 'unknown', number: 'current' },
      targetDocument,
      description: matchText.trim(),
      confidence,
      textPosition: { startIndex, endIndex },
      details
    };

    return relationship;
  }

  /**
   * Extrait les informations d'un document depuis une correspondance regex
   */
  private extractDocumentInfo(match: RegExpExecArray, context: string): LegalDocumentRef | null {
    try {
      const docType = match[1]?.toLowerCase() || 'unknown';
      const docNumber = match[2] || '';

      if (!docNumber) {
        return null;
      }

      // Rechercher la date dans le contexte proche
      const contextBefore = context.substring(Math.max(0, (match.index || 0) - 200), match.index || 0);
      const contextAfter = context.substring((match.index || 0) + match[0].length, (match.index || 0) + match[0].length + 200);
      const contextText = contextBefore + match[0] + contextAfter;

      const dates = this.extractDates(contextText);
      const authority = this.extractIssuingAuthority(contextText);

      return {
        type: docType,
        number: docNumber,
        date: dates,
        issuingAuthority: authority
      };

    } catch (error) {
      console.warn('⚠️ Error extracting document info:', error);
      return null;
    }
  }

  /**
   * Extrait les dates (grégorienne et hijri) d'un texte
   */
  private extractDates(text: string): { gregorian?: string; hijri?: string } | undefined {
    const dates: { gregorian?: string; hijri?: string } = {};

    // Date grégorienne
    const gregorianMatch = this.datePatterns.gregorian.exec(text);
    if (gregorianMatch) {
      dates.gregorian = `${gregorianMatch[1]} ${gregorianMatch[0].split(' ')[1]} ${gregorianMatch[2]}`;
    }

    // Date hijri
    const hijriMatch = this.datePatterns.hijri.exec(text);
    if (hijriMatch) {
      dates.hijri = hijriMatch[0];
    }

    // Correspondance
    const corrMatch = this.datePatterns.correspondance.exec(text);
    if (corrMatch && !dates.gregorian) {
      dates.gregorian = `${corrMatch[1]} ${corrMatch[0].split(' ')[3]} ${corrMatch[2]}`;
    }

    return Object.keys(dates).length > 0 ? dates : undefined;
  }

  /**
   * Extrait l'autorité émettrice d'un texte
   */
  private extractIssuingAuthority(text: string): string | undefined {
    for (const pattern of this.institutionPatterns) {
      const match = pattern.exec(text);
      if (match) {
        return match[0].trim();
      }
    }
    return undefined;
  }

  /**
   * Calcule la confiance d'une relation basée sur la spécificité du pattern
   */
  private calculateRelationshipConfidence(match: RegExpExecArray, type: string): number {
    let confidence = 0.7; // Base confidence

    // Bonus pour numéro de document spécifique
    if (match[2] && /\d{2,}-\d{2,}/.test(match[2])) {
      confidence += 0.1;
    }

    // Bonus pour type de document précis
    if (match[1] && ['loi', 'décret', 'ordonnance'].includes(match[1].toLowerCase())) {
      confidence += 0.1;
    }

    // Ajustements par type de relation
    switch (type) {
      case 'vu':
        confidence += 0.05; // Les liens "vu" sont généralement explicites
        break;
      case 'abrogation':
        confidence += 0.1; // Les abrogations sont très explicites
        break;
      case 'modification':
        confidence += 0.08; // Les modifications sont explicites
        break;
    }

    return Math.min(1.0, confidence);
  }

  /**
   * Extrait des détails spécifiques selon le type de relation
   */
  private extractRelationshipDetails(
    matchText: string, 
    type: keyof typeof this.relationshipPatterns,
    fullContext: string
  ): LegalRelationship['details'] | undefined {
    
    const details: LegalRelationship['details'] = {};

    switch (type) {
      case 'abrogation': {
        // Détecter si c'est une abrogation partielle
        const articleMatch = /articles?\s+([\d,\s\-et]+)/i.exec(matchText);
        if (articleMatch) {
          details.articlesAffected = articleMatch[1].split(/[,\s\-et]+/).filter(a => a.trim());
          details.partialAbrogation = true;
        } else {
          details.partialAbrogation = false;
        }
        break;
      }

      case 'extension': {
        // Extraire le domaine d'extension
        const extensionMatch = /(?:à|aux?)\s+([^.]+)/i.exec(matchText);
        if (extensionMatch) {
          details.extensionDomain = extensionMatch[1].trim();
        }
        break;
      }

      case 'controle':
        // Déterminer le niveau de conformité
        if (/constitutionnel/i.test(matchText)) {
          details.conformityLevel = 'constitutional';
        } else if (/légal/i.test(matchText)) {
          details.conformityLevel = 'legal';
        } else {
          details.conformityLevel = 'regulatory';
        }
        break;
    }

    return Object.keys(details).length > 0 ? details : undefined;
  }

  /**
   * Crée des clusters thématiques basés sur les relations
   */
  private createThematicClusters(relationships: LegalRelationship[]): DocumentCluster[] {
    const clusters: DocumentCluster[] = [];
    const processed = new Set<string>();

    for (const rel of relationships) {
      const sourceKey = this.getDocumentKey(rel.sourceDocument);
      const targetKey = this.getDocumentKey(rel.targetDocument);

      if (processed.has(sourceKey) || processed.has(targetKey)) {
        continue;
      }

      // Trouver tous les documents liés
      const relatedDocs = this.findRelatedDocuments(rel.sourceDocument, relationships);
      
      if (relatedDocs.length > 2) {
        clusters.push({
          id: `thematic_${clusters.length + 1}`,
          documents: relatedDocs,
          type: 'thematic',
          description: `Cluster thématique autour de ${rel.sourceDocument.type} ${rel.sourceDocument.number}`
        });

        relatedDocs.forEach(doc => processed.add(doc));
      }
    }

    return clusters;
  }

  /**
   * Crée des clusters chronologiques
   */
  private createChronologicalClusters(documents: LegalDocumentRef[]): DocumentCluster[] {
    // Grouper par année
    const yearGroups = new Map<string, LegalDocumentRef[]>();
    
    for (const doc of documents) {
      if (doc.date?.gregorian) {
        const year = doc.date.gregorian.split(' ').pop() || 'unknown';
        const existing = yearGroups.get(year) || [];
        existing.push(doc);
        yearGroups.set(year, existing);
      }
    }

    const clusters: DocumentCluster[] = [];
    for (const [year, docs] of yearGroups) {
      if (docs.length > 3) {
        clusters.push({
          id: `chronological_${year}`,
          documents: docs.map(d => this.getDocumentKey(d)),
          type: 'chronological',
          description: `Documents de l'année ${year}`
        });
      }
    }

    return clusters;
  }

  /**
   * Trouve tous les documents liés à un document donné
   */
  private findRelatedDocuments(document: LegalDocumentRef, relationships: LegalRelationship[]): string[] {
    const related = new Set<string>();
    const docKey = this.getDocumentKey(document);
    related.add(docKey);

    for (const rel of relationships) {
      const sourceKey = this.getDocumentKey(rel.sourceDocument);
      const targetKey = this.getDocumentKey(rel.targetDocument);

      if (sourceKey === docKey) {
        related.add(targetKey);
      } else if (targetKey === docKey) {
        related.add(sourceKey);
      }
    }

    return Array.from(related);
  }

  /**
   * Génère une clé unique pour un document
   */
  private getDocumentKey(document: LegalDocumentRef): string {
    return `${document.type}_${document.number}`;
  }
}

export const legalRelationshipService = new LegalRelationshipService();