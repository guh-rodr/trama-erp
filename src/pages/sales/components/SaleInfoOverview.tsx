import { ArrowSquareOutIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { ErrorNotification } from '../../../components/ErrorNotification';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { useSaleOverview } from '../../../hooks/useSales';
import { SaleRow } from '../../../types/sale';
import { SaleStatusBadge } from './SaleStatusBadge';

interface Props {
  id: SaleRow['id'];
}

export function SaleInfoOverview({ id }: Props) {
  const { data, isLoading, isError, isSuccess } = useSaleOverview(id);

  return (
    <div className="mt-4 space-y-1">
      {isLoading && <LoadingNotification />}

      {isError && <ErrorNotification />}

      {isSuccess && !!data && (
        <>
          <div className="flex justify-between items-center">
            Cliente
            <span className="text-neutral-600">
              {data.customer ? (
                <Link
                  to={`/customers?id=${data.customer.id}`}
                  target="_blank"
                  className="underline underline-offset-2 flex items-center gap-1"
                >
                  {data.customer.name}
                  <ArrowSquareOutIcon weight="bold" />
                </Link>
              ) : (
                '[Cliente não informado]'
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            Data
            <span className="text-neutral-600">{formatDate(data.purchasedAt)}</span>
          </div>

          <div className="flex justify-between items-center">
            Status
            <SaleStatusBadge status={data.status} size="sm" />
          </div>

          <div>
            <div className="flex justify-between items-center">
              Valor total
              <span className="text-neutral-600">{formatToReal(data.total)}</span>
            </div>

            <div className="flex justify-between items-center">
              Valor recebido
              <span className="text-neutral-600">{formatToReal(data.totalReceived)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              Lucro total
              <span className="text-emerald-600">{formatToReal(data.profit)}</span>
            </div>

            <div className="flex justify-between items-center">
              Lucro recebido
              <span className="text-emerald-600">+ {formatToReal(data.profitReceived)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
