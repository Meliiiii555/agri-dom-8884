
import { useState, useEffect } from "react";
import { AdministrativeProcedure } from "@/types/legal";
import { ProceduresTabs } from "@/components/ProceduresTabs";
import { ProcedureSummaryModal } from "@/components/ProcedureSummaryModal.tsx";
import { ProcedureDetailView } from "@/components/procedures/ProcedureDetailView";
import { ProcedureFormView } from "@/components/procedures/ProcedureFormView";
import { ApprovalQueueModal } from "@/components/ApprovalQueueModal";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ClipboardList } from "lucide-react";
import { mockProcedures } from "@/components/procedures/mockData";

export function AdministrativeProcedures() {
  const [selectedProcedure, setSelectedProcedure] = useState<AdministrativeProcedure | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'form'>('list');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showApprovalQueue, setShowApprovalQueue] = useState(false);
  const [lastAddedProcedure, setLastAddedProcedure] = useState<{
    id: string;
    name: string;
    description: string;
    sector: string;
    complexity: string;
  } | null>(null);
  const [ocrData, setOcrData] = useState<{
    documentType: 'legal' | 'procedure';
    formData: Record<string, string | number>;
  } | null>(null);

  const handleOCRDataExtracted = (data: { documentType: 'legal' | 'procedure', formData: Record<string, string | number> }) => {

    if (data.documentType === 'procedure') {

      setOcrData(data);
      setCurrentView('form');

    } else {
      console.warn('⚠️ [AdministrativeProcedures] Type de document non compatible avec les procédures administratives');
    }
  };

  const handleProcedureSubmit = (data: {
    id: string;
    name: string;
    description: string;
    sector: string;
    complexity: string;
  }) => {

    setLastAddedProcedure(data);
    setCurrentView('list');
    setShowSummaryModal(true);
    
    // Enregistrer dans le fil d'approbation
    const event = new CustomEvent('add-to-approval-queue', {
      detail: {
        type: 'procedure',
        data: data,
        title: data.name || 'Nouvelle procédure',
        description: data.description || 'Procédure administrative'
      }
    });
    window.dispatchEvent(event);
  };

  const handleAddAnotherProcedure = () => {
    setShowSummaryModal(false);
    setCurrentView('form');
  };

  const handleCloseSummary = () => {
    setShowSummaryModal(false);
    setLastAddedProcedure(null);
  };

  const handleOpenApprovalQueue = () => {

    setShowApprovalQueue(true);
  };

  const handleApproveFromQueue = (item: any, comment?: string) => {

  };

  const handleRejectFromQueue = (item: any, reason: string) => {

  };

  const handleViewFromQueue = (item: any) => {

    setShowApprovalQueue(false);
  };

  // Écouter l'événement de navigation avec données OCR
  useEffect(() => {
    const handleNavigateWithOCR = (event: CustomEvent) => {

      setOcrData(event.detail.ocrData);
      setCurrentView('form');
    };

    window.addEventListener('navigate-to-procedure-form-with-ocr', handleNavigateWithOCR as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to-procedure-form-with-ocr', handleNavigateWithOCR as EventListener);
    };
  }, []);

  if (currentView === 'form') {
    return (
      <ProcedureFormView 
        onBack={() => {
          setCurrentView('list');
          setOcrData(null);
        }}
        onSubmit={handleProcedureSubmit}
        ocrData={ocrData}
      />
    );
  }

  if (currentView === 'detail' && selectedProcedure) {
    return (
      <ProcedureDetailView 
        procedure={selectedProcedure}
        onBack={() => {
          setSelectedProcedure(null);
          setCurrentView('list');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Procédures Administratives"
        description="Gestion et consultation des procédures administratives algériennes"
        icon={ClipboardList}
        iconColor="text-blue-600"
      />
      
      <ProceduresTabs 
        section="procedures-catalog" 
        onAddProcedure={() => setCurrentView('form')}
        onOpenApprovalQueue={handleOpenApprovalQueue}
        onOCRDataExtracted={handleOCRDataExtracted}
      />
      
      <ProcedureSummaryModal
        isOpen={showSummaryModal}
        onClose={handleCloseSummary}
        onAddAnother={handleAddAnotherProcedure}
        procedureData={lastAddedProcedure}
      />

      <ApprovalQueueModal
        isOpen={showApprovalQueue}
        onClose={() => setShowApprovalQueue(false)}
        onApproveItem={handleApproveFromQueue}
        onRejectItem={handleRejectFromQueue}
        onViewItem={handleViewFromQueue}
        filterType="procedure"
      />
    </div>
  );
}
