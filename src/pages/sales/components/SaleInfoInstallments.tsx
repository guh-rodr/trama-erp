import { TrashIcon } from '@phosphor-icons/react';
import { ErrorNotification } from '../../../components/ErrorNotification';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { useSaleInstallments } from '../../../hooks/useSales';
import { SaleRow } from '../../../types/sale';
import { CreateInstallmentForm } from './CreateInstallmentForm';
import { InstallmentDeleteModal } from './InstallmentDeleteModal';

interface Props {
  id: SaleRow['id'];
}

export function SaleInfoInstallments({ id }: Props) {
  const { data, isLoading, isError, isSuccess } = useSaleInstallments(id);

  const { openDialog } = useDialog();

  const handleClickDelete = (installmentId: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <InstallmentDeleteModal saleId={id} installmentId={installmentId} />,
    });
  };

  return (
    <div className="mt-4 space-y-1">
      {isLoading && <LoadingNotification />}

      {isError && <ErrorNotification />}

      {isSuccess && !!data && (
        <>
          <CreateInstallmentForm saleId={id} />

          <div className="mt-6">
            {data.length ? (
              data.map((item, index) => (
                <div key={index} className="flex gap-2 group">
                  <div className="flex flex-col">
                    <span className="grid place-items-center size-3.5 rounded-full bg-neutral-300">
                      <span className="bg-neutral-400 size-1.5 rounded-full block" />
                    </span>
                    {index !== data.length - 1 && <span className="w-[2px] h-12 bg-neutral-300 ml-[6px] my-1.5" />}
                  </div>

                  <div className="flex w-full items-start justify-between">
                    <div className="flex flex-col text-sm -mt-1">
                      <span className="text-neutral-800 font-medium">{formatToReal(item.value)}</span>
                      <span className="text-neutral-600">{formatDate(item.paidAt)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClickDelete(item.id)}
                      className="text-red-500 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-200/40 p-2 transition-all mr-0 ml-auto"
                    >
                      <TrashIcon size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-center font-normal text-base text-neutral-400/70 pt-2 px-4 block">
                Nenhuma parcela registrada, você pode adicionar uma nova parcela.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
