import { Button } from '../../../components/Button';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useBulkDeleteProducts, useDeleteProduct } from '../../../hooks/useProducts';

interface Props {
  onDelete?: () => void;
  ids: string[];
}

export function ProductDeleteModal({ onDelete, ids }: Props) {
  const { closeDialog } = useDialog();
  const { mutate: deleteProductMutate, isPending: isPendingDelete } = useDeleteProduct();
  const { mutate: bulkDeleteProductsMutate, isPending: isPendingBulkDelete } = useBulkDeleteProducts();

  const isBulkDelete = ids.length > 1;

  const handleConfirm = () => {
    if (isBulkDelete) {
      bulkDeleteProductsMutate(ids, {
        onSuccess: () => {
          onDelete?.();
          closeDialog();
        },
      });
    } else {
      deleteProductMutate(ids[0], {
        onSuccess: () => {
          onDelete?.();
          closeDialog();
        },
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p>
          {isBulkDelete
            ? `Tem certeza que deseja remover ${ids.length} produtos?`
            : `Tem certeza que deseja remover esse cliente?`}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 !space-y-0">
        <Button type="button" variant="outline" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button type="button" isLoading={isPendingDelete || isPendingBulkDelete} onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
