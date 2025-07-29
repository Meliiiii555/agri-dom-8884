import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, CheckCircle, FileText, Settings } from 'lucide-react';
import { OCRScanner } from './OCRScanner';
import { extractLegalTextData, extractProcedureData } from '@/utils/ocrFormFiller';
import { useNomenclatureData } from '@/hooks/useNomenclatureData';

interface SmartOCRProcessorProps {
  onFormDataExtracted: (data: { documentType: 'legal' | 'procedure', formData: Record<string, any> }) => void;
  onClose?: () => void;
  title?: string;
  className?: string;
}

export function SmartOCRProcessor({ 
  onFormDataExtracted, 
  onClose, 
  title = "Scanner OCR Intelligent", 
  className = "" 
}: SmartOCRProcessorProps) {
  const [extractedData, setExtractedData] = useState<{ documentType: 'legal' | 'procedure', formData: Record<string, any> } | null>(null);
  const [showScanner, setShowScanner] = useState(true);
  const { mapOCRDataToForm, getFormTemplateWithNomenclature } = useNomenclatureData();

  const handleTextExtracted = (text: string) => {

    // Détecter le type de document avec patterns améliorés
    const lowerText = text.toLowerCase();
    const isLegalDocument = lowerText.includes('décret') || lowerText.includes('arrêté') || 
                           lowerText.includes('loi') || lowerText.includes('ordonnance') ||
                           lowerText.includes('journal officiel') || lowerText.includes('promulgation') ||
                           lowerText.includes('république algérienne') || lowerText.includes('ministère') ||
                           lowerText.includes('code') || lowerText.includes('instruction') ||
                           lowerText.includes('circulaire') || lowerText.includes('convention') ||
                           lowerText.includes('constitution') || lowerText.includes('jurisprudence');
    
    // Extraire les données avec les bonnes fonctions
    let parsedData: { documentType: 'legal' | 'procedure', formData: Record<string, any> };
    
    if (isLegalDocument) {
      const legalData = extractLegalTextData(text);
      const mappedLegalData = mapOCRDataToForm(legalData, 'legal');
      parsedData = { documentType: 'legal', formData: mappedLegalData };
    } else {
      const procedureData = extractProcedureData(text);
      const mappedProcedureData = mapOCRDataToForm(procedureData, 'procedure');
      parsedData = { documentType: 'procedure', formData: mappedProcedureData };
    }

    setExtractedData(parsedData);
    setShowScanner(false);
  };

  const handleValidateAndUse = () => {

    if (extractedData) {

      // Appel de la fonction callback
      try {
        onFormDataExtracted(extractedData);

      } catch (error) {
        console.error('❌ [SmartOCRProcessor] Erreur lors de l\'appel du callback:', error);
      }
      
      // Fermer le scanner après un petit délai pour permettre au parent de traiter
      if (onClose) {

        setTimeout(() => {
          onClose();
        }, 100);
      }
    } else {
      console.warn('⚠️ [SmartOCRProcessor] Aucune donnée extraite disponible');
    }
  };

  const handleNewScan = () => {
    setExtractedData(null);
    setShowScanner(true);
  };

  if (showScanner) {
    return (
      <OCRScanner
        onTextExtracted={handleTextExtracted}
        onClose={onClose}
        title={title}
        className={className}
      />
    );
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Validation des Données Extraites
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {extractedData && (
          <>
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                Document reconnu : {extractedData.documentType === 'legal' ? 'Texte Juridique' : 'Procédure Administrative'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Champs Identifiés ({Object.keys(extractedData.formData).length})
                  </span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(extractedData.formData).map(([key, value]) => {
                    if (key === 'contenu') return null; // Skip content field for preview
                    return (
                      <div key={key} className="text-xs">
                        <span className="font-medium text-blue-600">
                          {key.replace(/_/g, ' ').toUpperCase()}:
                        </span>
                        <span className="ml-2 text-gray-700">
                          {typeof value === 'string' && value.length > 50 
                            ? `${value.substring(0, 50)}...` 
                            : String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Scan className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Contenu Complet
                  </span>
                </div>
                <div className="bg-white border rounded p-3 max-h-40 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs text-gray-700">
                    {extractedData.formData.contenu?.substring(0, 300)}
                    {extractedData.formData.contenu?.length > 300 ? '...' : ''}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleValidateAndUse} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Valider et Remplir le Formulaire
              </Button>
              <Button onClick={handleNewScan} variant="outline">
                <Scan className="w-4 h-4 mr-2" />
                Nouveau Scan
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="ghost">
                  Fermer
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}