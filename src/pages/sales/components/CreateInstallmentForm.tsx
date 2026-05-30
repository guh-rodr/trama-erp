import { ChecksIcon, CircleNotchIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCreateSaleInstallment, useSaleOverview } from '../../../hooks/useSales';
import { getTodayDate } from '../../../lib/date';
import { SaleInstallmentForm, SaleRow } from '../../../types/sale';
import { InstallmentContainer } from './InstallmentContainer';

const defaultCurrentDate = getTodayDate();

interface Props {
  saleId: SaleRow['id'];
}

export function CreateInstallmentForm({ saleId }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { handleSubmit, control, watch, reset } = useForm<SaleInstallmentForm>({
    defaultValues: {
      paidAt: defaultCurrentDate,
      value: 0,
    },
  });

  const { mutate, isPending } = useCreateSaleInstallment();

  const onSubmit: SubmitHandler<SaleInstallmentForm> = (data) => {
    mutate(
      { saleId, data },
      {
        onSuccess: () => {
          reset();
          setIsExpanded(false);
        },
      },
    );
  };

  const { data, isFetching } = useSaleOverview(saleId);

  const installmentValue = watch('value');

  const missingValue = data ? data.total - data.totalReceived - installmentValue : 0;
  const isIntallmentTooHigh = missingValue < 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 border-b border-neutral-300/50 pb-4">
      <div className="flex justify-between">
        {isExpanded ? (
          <button
            disabled={isFetching || isPending || isIntallmentTooHigh || installmentValue === 0}
            className="text-emerald-500 disabled:opacity-50 disabled:!cursor-default text-sm transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
            type="submit"
          >
            {isFetching || isPending ? (
              <>
                <CircleNotchIcon weight="bold" className="animate-spin" /> Processando...
              </>
            ) : (
              <>
                <ChecksIcon weight="bold" /> Confirmar
              </>
            )}
          </button>
        ) : (
          <button
            className="text-emerald-500 text-sm transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
            onClick={() => setIsExpanded(true)}
            type="button"
          >
            <PlusIcon weight="bold" /> Adicionar uma parcela
          </button>
        )}

        {isExpanded && (
          <button
            className="text-red-500 text-sm transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
            onClick={() => setIsExpanded(false)}
            type="button"
          >
            <XIcon weight="bold" /> Cancelar
          </button>
        )}
      </div>

      {isExpanded && (
        <InstallmentContainer
          control={control}
          valueFieldName="value"
          paidAtFieldName="paidAt"
          missingValue={missingValue}
          maxInstallmentValue={data!.total - data!.totalReceived}
          isInstallmentTooHigh={isIntallmentTooHigh}
        />
      )}
    </form>
  );
}
