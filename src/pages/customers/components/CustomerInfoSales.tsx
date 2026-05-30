import { ArrowSquareOutIcon, CaretRightIcon, ShoppingCartIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '../../../components/Card';
import { ErrorNotification } from '../../../components/ErrorNotification';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { useCustomerPurchases } from '../../../hooks/useCustomers';

interface Props {
  id: string;
}

export function CustomerInfoSales({ id }: Props) {
  const [expandedSaleId, setExpandedSaleId] = useState('');

  const { data: sales, isLoading, isError, isSuccess } = useCustomerPurchases({ id });

  const handleExpandSale = (id: string) => {
    if (id === expandedSaleId) {
      setExpandedSaleId('');
    } else {
      setExpandedSaleId(id);
    }
  };

  return (
    <div className="mt-4 space-y-1">
      {isLoading && <LoadingNotification />}

      {isError && <ErrorNotification />}

      {isSuccess && !!sales && (
        <div className="space-y-3">
          {sales.length ? (
            sales!.map((sale) => (
              <Card key={sale.id} className="p-0">
                <div
                  className="flex text-sm p-2.5 hover:bg-neutral-100/70 transition-colors cursor-pointer"
                  onClick={() => handleExpandSale(sale.id)}
                >
                  {sale.status === 'paid' ? (
                    <span className="bg-emerald-200/20 border border-emerald-200 rounded-lg p-2 block w-fit text-emerald-300">
                      <ShoppingCartIcon size={24} />
                    </span>
                  ) : (
                    <span className="bg-amber-200/20 border border-amber-200 rounded-lg p-2 block w-fit text-amber-300">
                      <ShoppingCartIcon size={24} />
                    </span>
                  )}

                  <div className="flex items-center flex-1 justify-between">
                    <div className="flex flex-col justify-between ml-2">
                      <div className="text-neutral-800 font-medium flex gap-2">{formatToReal(sale.total)}</div>

                      <div className="text-neutral-500">{formatDate(sale.purchasedAt)}</div>
                    </div>

                    <CaretRightIcon
                      weight="bold"
                      size={14}
                      className={`text-neutral-500 ${expandedSaleId === sale.id ? 'rotate-90' : ''} transition-all`}
                    />
                  </div>
                </div>
                {expandedSaleId === sale.id && (
                  <div className="p-2.5 pt-0">
                    <div className="grid grid-cols-3 gap-y-3 w-full border-y border-neutral-200 py-2 px-1">
                      <div className="flex flex-col text-sm text-neutral-500">
                        Qntd. Itens
                        <span className="text-black">{sale.itemCount}</span>
                      </div>

                      <div className="flex flex-col text-sm text-neutral-500">
                        Valor total
                        <span className="text-black">{formatToReal(sale.total)}</span>
                      </div>

                      <div className="flex flex-col text-sm text-neutral-500">
                        Valor recebido
                        <span className="text-black">{formatToReal(sale.totalReceived)}</span>
                      </div>

                      <div className="flex flex-col text-sm text-neutral-500">
                        Qntd. Parcelas
                        <span className="text-black">{sale.installmentCount}</span>
                      </div>

                      <div className="flex flex-col text-sm text-neutral-500">
                        Lucro total
                        <span className="text-black">{formatToReal(sale.profit)}</span>
                      </div>

                      <div className="flex flex-col text-sm text-neutral-500">
                        Lucro recebido
                        <span className="text-black">{formatToReal(sale.profitReceived)}</span>
                      </div>
                    </div>

                    <Link
                      to={`/sales?id=${sale.id}`}
                      target="_blank"
                      className="flex w-fit items-center gap-1 mt-2 text-sm text-emerald-500 underline underline-offset-2 hover:opacity-70 transition-all"
                    >
                      Ver informações detalhadas <ArrowSquareOutIcon weight="bold" />
                    </Link>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <span className="text-center text-base text-neutral-400 pt-4 px-4 block">
              Nenhuma compra registrada, comece adicionando uma
            </span>
          )}
        </div>
      )}
    </div>
  );
}
