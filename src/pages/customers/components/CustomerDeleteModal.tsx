import { Button } from '../../../components/Button';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useBulkDeleteCustomers, useDeleteCustomer } from '../../../hooks/useCustomers';

interface Props {
  onDelete?: () => void;
  ids: string[];
}

export function CustomerDeleteModal({ onDelete, ids }: Props) {
  const { closeDialog } = useDialog();
  const { mutate: deleteCustomerMutate, isPending: isPendingDelete } = useDeleteCustomer();
  const { mutate: bulkDeleteCustomersMutate, isPending: isPendingBulkDelete } = useBulkDeleteCustomers();

  const isBulkDelete = ids.length > 1;

  const handleConfirm = () => {
    if (isBulkDelete) {
      bulkDeleteCustomersMutate(
        { ids },
        {
          onSuccess: () => {
            onDelete?.();
            closeDialog();
          },
        },
      );
    } else {
      deleteCustomerMutate(
        { id: ids[0] },
        {
          onSuccess: () => {
            onDelete?.();
            closeDialog();
          },
        },
      );
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p>
          {isBulkDelete
            ? `Tem certeza que deseja remover ${ids.length} clientes?`
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
