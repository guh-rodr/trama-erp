import { CurrencyDollarIcon, PackageIcon, TShirtIcon, WarningIcon } from '@phosphor-icons/react';
import { isAfter, parseISO } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { Textarea } from '../../../components/Textarea';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { formatToReal } from '../../../functions/currency';
import { useProductVariants } from '../../../hooks/useProducts';
import { useCreateStockMovement } from '../../../hooks/useStockMovement';
import { getTodayDate } from '../../../lib/date';
import { ProductVariant } from '../../../types/product';
import { StockMovementValues } from '../../../types/stock-movement';
import { COLORS } from '../../../utils/colors';

interface Props {
  productId: string;
  productName: string;
  currentStock: number;
}

interface InnerProps {
  productName: string;
  currentStock: number;
  variants: Partial<ProductVariant>[];
}

const currentDate = getTodayDate();

export function StockMovementFormDrawer({ productId, productName, currentStock }: Props) {
  const { data: variants, isFetching } = useProductVariants({ id: productId });

  if (isFetching || !variants) {
    return <LoadingNotification />;
  }

  return <StockMovementForm productName={productName} variants={variants} currentStock={currentStock} />;
}

function StockMovementForm({ productName, variants, currentStock }: InnerProps) {
  const { closeDialog } = useDialog();

  const variantsOptions = useMemo(
    () =>
      variants?.map((v) => {
        const colorName = COLORS.find((c) => c.value === v.color)?.label ?? '';
        const size = v.size?.toUpperCase() ?? '';

        return {
          label: `${size} ∙ ${colorName}`,
          value: v.id!,
        };
      }) ?? [],
    [variants],
  );

  const isSimple = !variants[0].color && !variants[0].size;

  const { mutate: createStockMovement } = useCreateStockMovement();

  const { control, register, handleSubmit, watch } = useForm<StockMovementValues>({
    defaultValues: {
      variantId: isSimple ? variants?.[0]?.id : undefined,
      date: getTodayDate(),
    },
  });

  const onSubmit: SubmitHandler<StockMovementValues> = (data) => {
    createStockMovement(data, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  }, []);

  const selectedVariantId = watch('variantId');
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const averageCost = selectedVariant?.averageCost ?? selectedVariant?.costPrice ?? null;

  const selectedDate = watch('date');
  const isInvalidDate = isAfter(parseISO(selectedDate), parseISO(currentDate));

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col justify-between gap-4 h-full">
      <div className="space-y-4">
        <Card className="flex justify-between shadow-xs p-3">
          <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
            <TShirtIcon size={18} weight="duotone" className="text-neutral-500 flex-shrink-0" />
            <div className="text-sm text-neutral-600 min-w-0 w-full">
              Produto
              <span className="block text-neutral-900 font-semibold truncate">{productName}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-1">
            <PackageIcon size={18} weight="duotone" className="text-neutral-500" />
            <div className="text-sm text-neutral-600">
              Saldo atual
              <span className="block text-neutral-900 font-semibold">{currentStock} und.</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-1">
            <CurrencyDollarIcon size={18} weight="duotone" className="text-neutral-500" />
            <div className="text-sm text-neutral-600">
              Custo médio
              <span className="block text-neutral-900 font-semibold">
                {averageCost !== null ? formatToReal(averageCost) : '—'}
              </span>
            </div>
          </div>
        </Card>

        <hr className="border-neutral-200" />

        <div>
          <Label required>Tipo</Label>

          <Controller
            name="type"
            defaultValue="ENTRY"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                value={field.value}
                readOnly
                options={[
                  { label: 'Entrada', value: 'ENTRY' },
                  { label: 'Saída', value: 'EXIT' },
                ]}
                onChangeOption={field.onChange}
              />
            )}
          />
        </div>

        {!isSimple && (
          <div className="has-disabled:opacity-50">
            <Label required>Variante</Label>

            <Controller
              name="variantId"
              control={control}
              rules={{ required: 'A variante é obrigatória' }}
              render={({ field }) => (
                <Autocomplete
                  value={field.value}
                  className="disabled:border-neutral-300"
                  options={variantsOptions}
                  onChangeOption={field.onChange}
                />
              )}
            />
          </div>
        )}

        <div className="flex gap-3 [&>div]:flex-1">
          <div>
            <Label required>Quantidade</Label>

            <Input {...register('quantity', { required: true, valueAsNumber: true })} type="number" />
          </div>

          <div>
            <Label required>Data</Label>

            <Input {...register('date', { required: true })} type="date" />

            {isInvalidDate && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1.5">
                <WarningIcon weight="bold" />A data não pode ser futura
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Custo unitário</Label>

          <Controller
            name="unitCost"
            control={control}
            render={({ field }) => <CurrencyInput {...field} onValueChange={field.onChange} />}
          />
        </div>

        <div>
          <Label>Observação</Label>

          <Textarea {...register('reason')} rows={4} />
        </div>
      </div>

      <div className="flex gap-4 justify-between [&>button]:h-full">
        <Button className="flex-1" variant="outline" onClick={() => closeDialog()} type="button">
          Cancelar
        </Button>
        <Button className="flex-1" disabled={isInvalidDate} type="submit">
          Registrar movimentação
        </Button>
      </div>
    </form>
  );
}
