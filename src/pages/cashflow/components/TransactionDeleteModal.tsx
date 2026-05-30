import { Button } from '../../../components/Button';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useBulkDeleteTransactions, useDeleteTransaction } from '../../../hooks/useTransactions';
import { TransactionRow } from '../../../types/transaction';

interface Props {
  isSale?: boolean;
  ids: TransactionRow['id'][];
  onDelete?: () => void;
}

export function TransactionDeleteModal({ ids, onDelete, isSale = false }: Props) {
  const { closeDialog } = useDialog();

  const { mutate: deleteTransactionMutate, isPending: isPendingDelete } = useDeleteTransaction();
  const { mutate: bulkDeleteTransactionsMutate, isPending: isPendingDeleteMany } = useBulkDeleteTransactions();

  const isManyDelete = Array.isArray(ids) && ids.length > 1;

  const handleConfirm = () => {
    if (isManyDelete) {
      bulkDeleteTransactionsMutate(ids, {
        onSuccess: () => {
          onDelete?.();
          closeDialog();
        },
      });
    } else {
      deleteTransactionMutate(ids[0], {
        onSuccess() {
          onDelete?.();
          closeDialog();
        },
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p>Tem certeza que deseja remover essa transação?</p>

        {isSale && (
          <span className="bg-amber-200/50 block px-2 text-amber-600 py-2 rounded-md border-l-3 border-amber-500 text-sm">
            Há uma venda relacionada a essa transação. Ao confirmar, essa venda será automaticamente excluída.
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 !space-y-0">
        <Button type="button" variant="outline" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button type="button" isLoading={isPendingDelete || isPendingDeleteMany} onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
