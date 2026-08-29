import { useDialog } from '../contexts/dialog/dialog-context';
import { Button } from './Button';

interface Props {
  description: string;
  isLoading?: boolean;
  onConfirm: () => Promise<unknown>;
}

export function ConfirmationModal({ description, isLoading, onConfirm }: Props) {
  const { closeDialog } = useDialog();

  const handleConfirm = async () => {
    await onConfirm();
    closeDialog();
  };

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p>{description}</p>
      </div>

      <div className="flex items-center justify-between gap-2 !space-y-0 *:w-full">
        <Button type="button" variant="outline" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button type="button" isLoading={isLoading} onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
