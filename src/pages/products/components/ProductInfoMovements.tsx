import { format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { ErrorNotification } from '../../../components/ErrorNotification';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { formatToReal } from '../../../functions/currency';
import { useFetchProductVariants } from '../../../hooks/useProducts';
import { useFetchStockMovementsFromProduct } from '../../../hooks/useStockMovement';
import { ProductVariant } from '../../../types/product';
import { StockMovementFetchParams } from '../../../types/stock-movement';
import { COLORS } from '../../../utils/colors';

interface Props {
  id: string;
}

const typeMap = {
  ENTRY: {
    label: 'Entrada',
    styles: 'border-emerald-300 bg-emerald-100/50 text-emerald-500',
  },
  EXIT: {
    label: 'Saída',
    styles: 'border-red-300 bg-red-100/50 text-red-500',
  },
};

const originMap = {
  MANUAL: 'Manual',
  PURCHASE: 'Compra',
  SALE: 'Venda',
};

const getVariantName = (variant: Partial<ProductVariant>) => {
  const getColorName = () => COLORS.find((c) => c.value === variant.color)?.label;
  const variantName = !variant.color ? 'Padrão' : `${getColorName()} ∙ ${variant.size!.toUpperCase()}`;

  return variantName;
};

export function ProductInfoMovements({ id }: Props) {
  const [filter, setFilters] = useState<StockMovementFetchParams>({ productId: id, variantId: '', type: '' });

  const { data: stockMovementsData, isFetching, isError } = useFetchStockMovementsFromProduct(filter);
  const { data: variants, status: variantsFetchStatus } = useFetchProductVariants({ id });

  const variantsOptions =
    useMemo(
      () => variants?.map(({ id, color, size }) => ({ label: getVariantName({ color, size }), value: id! })),
      [variants],
    ) ?? [];

  const typeOptions = useMemo(
    () => [
      { label: 'Entrada', value: 'ENTRY' },
      { label: 'Saída', value: 'EXIT' },
    ],
    [],
  );

  if (isFetching) {
    return <LoadingNotification />;
  }

  if (isError) {
    return <ErrorNotification />;
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 [&>div]:w-full">
        <Autocomplete
          readOnly
          value={filter.variantId}
          onChangeOption={(v) => setFilters((current) => ({ ...current, variantId: v }))}
          status={variantsFetchStatus}
          options={[{ label: 'Todas as variantes', value: '' }, ...variantsOptions]}
        />

        <Autocomplete
          readOnly
          onChangeOption={(v) => setFilters((current) => ({ ...current, type: v as StockMovementFetchParams['type'] }))}
          value={filter.type}
          status={variantsFetchStatus}
          options={[{ label: 'Todos os tipos', value: '' }, ...typeOptions]}
        />
      </div>

      <table className="rounded-xl text-left bg-white shadow-sm w-full">
        <thead>
          <tr className="text-neutral-800 uppercase text-xs *:p-3">
            <th>Data</th>
            <th>Variante</th>
            <th>Tipo</th>
            <th>Qntd.</th>
            <th>Custo un.</th>
            <th>Origem</th>
          </tr>
        </thead>

        <tbody className="relative">
          {stockMovementsData?.items.length === 0 && (
            <tr className="border-y border-neutral-200 text-neutral-600 text-sm relative *:p-3">
              <td colSpan={6} className="p-6 text-center text-sm text-neutral-400">
                Nenhuma movimentação encontrada.
              </td>
            </tr>
          )}
          {stockMovementsData?.items.map((movement) => {
            const dateObj = parseISO(movement.date);
            const formattedDate = format(dateObj, 'dd/MM');

            return (
              <tr key={movement.id} className="border-y border-neutral-200 text-neutral-600 text-sm relative *:p-3">
                <td>{formattedDate}</td>

                <td>{getVariantName(movement.variant)}</td>

                <td>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-xl border ${typeMap[movement.type].styles}`}
                  >
                    {typeMap[movement.type].label}
                  </span>
                </td>

                <td>
                  <span className={movement.type === 'ENTRY' ? 'text-emerald-500' : 'text-red-500'}>
                    {movement.type === 'ENTRY' ? '+' : '-'}
                    {movement.quantity}
                  </span>
                </td>

                <td>{movement.unitCost != null ? formatToReal(movement.unitCost) : <span className="ml-6">—</span>}</td>

                <td>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-xl border border-neutral-300 bg-neutral-100/50 text-neutral-500">
                    {originMap[movement.origin]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
