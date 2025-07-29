
interface ProcedureActionHandlersProps {
  onAddProcedure?: () => void;
  onOpenApprovalQueue?: () => void;
  children: (handlers: {
    handleAddClick: () => void;
    handleOpenApprovalQueue: () => void;
  }) => React.ReactNode;
}

export function ProcedureActionHandlers({ 
  onAddProcedure, 
  onOpenApprovalQueue, 
  children 
}: ProcedureActionHandlersProps) {
  // Log de débogage pour vérifier la transmission des props

  const handleAddClick = () => {

    if (onAddProcedure) {
      onAddProcedure();
    } else {
      console.error('onAddProcedure function not provided');
    }
  };

  const handleOpenApprovalQueue = () => {

    if (onOpenApprovalQueue) {

      onOpenApprovalQueue();
    } else {
      console.error('ProcedureActionHandlers - onOpenApprovalQueue function not provided');
    }
  };

  return (
    <>
      {children({ handleAddClick, handleOpenApprovalQueue })}
    </>
  );
}
