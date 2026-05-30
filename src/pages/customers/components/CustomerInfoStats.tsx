import { ErrorNotification } from '../../../components/ErrorNotification';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { formatToReal } from '../../../functions/currency';
import { useCustomerStats } from '../../../hooks/useCustomers';
import { COLORS } from '../../../utils/colors';

interface Props {
  id: string;
}

export function CustomerInfoStats({ id }: Props) {
  const { data, isLoading, isError, isSuccess } = useCustomerStats({ id });

  const colorName = COLORS.find((c) => c.value === data?.preferences.topColor)?.label;

  return (
    <div className="mt-4 space-y-2">
      {isLoading && <LoadingNotification />}

      {isError && <ErrorNotification />}

      {isSuccess && !!data && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-2.5 rounded-lg shadow flex gap-1 flex-col text-sm flex-1 h-fit border border-neutral-200/80 text-neutral-500">
              Total pago
              <span className="text-neutral-800 text-base font-semibold">{formatToReal(data.metrics.totalPaid)}</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg shadow flex gap-1 flex-col text-sm flex-1 h-fit border border-neutral-200/80 text-neutral-500">
              Ticket médio
              <span className="text-neutral-800 text-base font-semibold">{formatToReal(data.metrics.avgTicket)}</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg shadow flex gap-1 flex-col text-sm flex-1 h-fit border border-neutral-200/80 text-neutral-500">
              Dívida
              <span className="text-neutral-800 text-base font-semibold">{formatToReal(data.metrics.debt)}</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg shadow flex gap-1 flex-col text-sm flex-1 h-fit border border-neutral-200/80 text-neutral-500">
              Categoria fav.
              <span
                title={data.preferences.topCategory || 'N/A'}
                className="text-neutral-800 text-base font-semibold truncate"
              >
                {data.preferences.topCategory || 'N/A'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg shadow flex gap-1 flex-col text-sm flex-1 h-fit border border-neutral-200/80 text-neutral-500">
              Cor fav.
              <span title={colorName || 'N/A'} className="text-neutral-800 text-base font-semibold truncate">
                {colorName || 'N/A'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg shadow flex gap-1 flex-col text-sm flex-1 h-fit border border-neutral-200/80 text-neutral-500">
              Tamanho fav.
              <span className="text-neutral-800 text-base font-semibold">
                {data.preferences.topSize?.toUpperCase() || 'N/A'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
