import { Button } from '../../../components/Button';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useDeleteCategory } from '../../../hooks/useCategories';

interface Props {
  id: string;
  name: string;
  onDelete?: () => void;
}

export function CategoryDeleteModal({ id, name, onDelete }: Props) {
  const { closeDialog } = useDialog();
  const { mutate, isPending } = useDeleteCategory();

  const handleConfirm = () => {
    mutate(id, {
      onSuccess: () => {
        closeDialog();
        onDelete?.();
      },
    });
  };

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p>
          Tem certeza que deseja remover <strong>{name}</strong>?
        </p>

        <span className="bg-amber-200/50 block h- px-2 text-amber-600 py-2 rounded-md border-l-3 border-amber-500 text-sm">
          Todos os dados e estatísticas relacionados a essa categoria serão automaticamente removidos ao confirmar.
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 !space-y-0">
        <Button type="button" variant="outline" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button type="button" isLoading={isPending} onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
