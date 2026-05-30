import { ErrorNotification } from '../../../components/ErrorNotification';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { formatDate } from '../../../functions/formatDate';
import { useCustomerOverview } from '../../../hooks/useCustomers';

interface Props {
  id: string;
}

export function CustomerInfoOverview({ id }: Props) {
  const { data, isLoading, isError, isSuccess } = useCustomerOverview({ id });

  return (
    <div className="mt-4 space-y-1">
      {isLoading && <LoadingNotification />}

      {isError && <ErrorNotification />}

      {isSuccess && !!data && (
        <>
          <div className="flex justify-between items-center">
            Nome
            <span className="text-neutral-600">{data.name}</span>
          </div>

          <div className="flex justify-between items-center">
            Telefone
            <span className="text-neutral-600">{data.phone || 'Não informado'}</span>
          </div>

          <div className="flex justify-between items-center">
            Última compra
            <span className="text-neutral-600">{formatDate(data.lastPurchaseAt)}</span>
          </div>
        </>
      )}
    </div>
  );
}
