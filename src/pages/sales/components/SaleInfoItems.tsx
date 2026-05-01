import { CaretRightIcon, TShirtIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Card } from '../../../components/Card';
import { ErrorNotification } from '../../../components/ErrorNotification';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { formatToReal } from '../../../functions/currency';
import { useFetchSaleItems } from '../../../hooks/useSales';
import { SaleRow } from '../../../types/sale';
import { COLORS } from '../../../utils/colors';

interface Props {
  id: SaleRow['id'];
}

export function SaleInfoItems({ id }: Props) {
  const { data, isLoading, isSuccess, isError } = useFetchSaleItems(id);

  const [expandedItemId, setExpandedItemId] = useState('');

  const handleExpandSale = (itemId: string) => {
    if (itemId === expandedItemId) {
      setExpandedItemId('');
    } else {
      setExpandedItemId(itemId);
    }
  };

  const getPercentage = (n1: number, n2: number) => Math.floor((n1 / n2) * 100);

  return (
    <div className="mt-4 space-y-1">
      {isLoading && <LoadingNotification />}

      {isError && <ErrorNotification />}

      {isSuccess && !!data && (
        <div className="space-y-6">
          {data.map((item) => {
            const color = COLORS.find((c) => c.value === item.variant.color);
            const profit = item.salePrice - item.costPrice;

            return (
              <Card key={item.id} className="p-0">
                <div
                  className="flex gap-1 text-sm p-2.5 hover:bg-neutral-100/70 transition-colors cursor-pointer"
                  onClick={() => handleExpandSale(item.id!)}
                >
                  <span className="bg-gray-200/20 border border-gray-200 rounded-lg p-2 block size-fit text-gray-300 my-auto">
                    <TShirtIcon size={24} />
                  </span>

                  <div className="flex items-center flex-1 justify-between">
                    <div className="flex flex-col justify-between ml-2">
                      <div className="space-x-2">
                        <span className="rounded-full text-center text-xs w-fit px-2 border border-indigo-100 font-medium bg-indigo-100/50 text-indigo-500">
                          {item.categoryName}
                        </span>

                        <span className="font-medium">{item.productName}</span>
                      </div>

                      <span className="pt-0.5 text-[15px] font-medium">
                        {item.variant.color && color && item.variant.size && (
                          <span className="text-sm font-normal text-neutral-500 pl-1">
                            {item.variant.size.toUpperCase()} ∙ {color.label}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-medium text-[15px] block">
                          {formatToReal(item.quantity * item.salePrice)}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {item.quantity} {item.quantity > 1 ? 'itens' : 'item'}
                        </span>
                      </div>
                      <CaretRightIcon
                        weight="bold"
                        size={14}
                        className={`text-neutral-500 ${expandedItemId === item.id ? 'rotate-90' : ''} transition-all`}
                      />
                    </div>
                  </div>
                </div>
                {expandedItemId === item.id && (
                  <div className="p-2.5 pt-0">
                    <div className="grid grid-cols-3 gap-y-3 w-full border-t border-neutral-200 py-2 px-1">
                      {item.variant.color && color && item.variant.size && (
                        <>
                          <div className="flex flex-col text-sm text-neutral-800 font-medium">
                            Tamanho
                            <span className="text-neutral-500 font-normal">{item.variant.size.toUpperCase()}</span>
                          </div>

                          <div className="flex flex-col text-sm text-neutral-800 font-medium">
                            Cor
                            <span className="text-neutral-500 font-normal">{color.label}</span>
                          </div>
                        </>
                      )}

                      <div className="flex flex-col text-sm text-neutral-800 font-medium">
                        P. Compra (und.)
                        <span className="text-neutral-500 font-normal">{formatToReal(item.costPrice)}</span>
                      </div>

                      <div className="flex flex-col text-sm text-neutral-800 font-medium">
                        P. Venda (und.)
                        <span className="text-neutral-500 font-normal">{formatToReal(item.salePrice)}</span>
                      </div>

                      <div className="flex flex-col text-sm text-neutral-800 font-medium">
                        Lucro (und.)
                        <span className="text-emerald-600 font-normal">{formatToReal(profit)}</span>
                      </div>

                      <div className="flex flex-col text-sm text-neutral-800 font-medium">
                        Lucro total
                        <span className="text-emerald-600 font-normal">
                          {formatToReal(profit * item.quantity)} ({getPercentage(profit, item.salePrice)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
