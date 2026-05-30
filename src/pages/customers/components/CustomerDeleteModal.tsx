import { useState } from 'react';
import { Button } from '../../../components/Button';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useBulkDeleteCustomers, useDeleteCustomer } from '../../../hooks/useCustomers';
import { CustomerRow } from '../../../types/customer';

interface Props {
  onDelete?: (ids: Pick<CustomerRow, 'id'>[]) => void;
  customers: Pick<CustomerRow, 'id' | 'name'>[] | Pick<CustomerRow, 'id'>[];
}

export function CustomerDeleteModal({ onDelete, customers }: Props) {
  const [canDeleteSales, setCanDeleteSales] = useState(false);

  const { closeDialog } = useDialog();
  const { mutate: deleteCustomerMutate, isPending: isPendingDelete } = useDeleteCustomer();
  const { mutate: deleteManyCustomersMutate, isPending: isPendingManyDelete } = useBulkDeleteCustomers();

  const isManyDelete = Array.isArray(customers) && customers.length > 1;

  const handleConfirm = () => {
    const ids = customers.map((r) => r.id);

    if (isManyDelete) {
      deleteManyCustomersMutate(
        { ids, canDeleteSales },
        {
          onSuccess: () => {
            onDelete?.(customers);
            closeDialog();
          },
        },
      );
    } else {
      deleteCustomerMutate(
        { id: ids[0], canDeleteSales },
        {
          onSuccess: () => {
            onDelete?.(customers);
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
          {isManyDelete
            ? `Tem certeza que deseja remover ${customers.length} clientes?`
            : `Tem certeza que deseja remover esse cliente?`}
        </p>

        <div className="flex items-center justify-between gap-2 bg-amber-200/50 px-2 text-amber-600 py-2 rounded-md border-l-3 border-amber-500 text-sm">
          Excluir todas as vendas referentes a {isManyDelete ? 'esses clientes?' : 'esse cliente?'}
          <ToggleSwitch isOn={canDeleteSales} onToggle={setCanDeleteSales} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 !space-y-0">
        <Button type="button" variant="outline" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button type="button" isLoading={isPendingDelete || isPendingManyDelete} onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
