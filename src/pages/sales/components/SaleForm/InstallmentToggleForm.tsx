import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ToggleSwitch } from '../../../../components/ToggleSwitch';
import { convertToCents } from '../../../../functions/currency';
import { SaleForm } from '../../../../types/sale';
import { InstallmentContainer } from '../InstallmentContainer';

export function InstallmentToggleForm() {
  const { control, resetField } = useFormContext<SaleForm>();
  const [isEnabled, setIsEnabled] = useState(false);

  const [items, installment] = useWatch({
    control,
    name: ['items', 'installment'],
  });

  const canEnableInstallment = items.every((i) => i.salePrice && i.salePrice > 0);

  const installmentValue = convertToCents(installment?.value || 0);
  const receivedTotal = items.reduce((prev, curr) => prev + convertToCents(curr.salePrice || 0), 0);

  const missingValue = Math.max(receivedTotal - installmentValue, 0);

  useEffect(() => {
    if (!canEnableInstallment && isEnabled) {
      resetField('installment');
      setIsEnabled(false);
    }
  }, [canEnableInstallment, isEnabled, resetField]);

  const toggleInstallmentState = () => {
    setIsEnabled((prev) => {
      if (prev) resetField('installment');
      return !prev;
    });
  };

  return (
    <>
      <div
        className={`flex justify-between items-center ${!canEnableInstallment ? 'opacity-50 [&>button]:cursor-not-allowed pointer-events-none' : ''} transition-all`}
      >
        Parcelamento
        <ToggleSwitch isOn={isEnabled} onToggle={toggleInstallmentState} />
      </div>

      {isEnabled && (
        <InstallmentContainer
          control={control}
          valueFieldName="installment.value"
          paidAtFieldName="installment.paidAt"
          missingValue={missingValue}
          maxInstallmentValue={receivedTotal}
          isInstallmentTooHigh={installmentValue > receivedTotal}
        />
      )}
    </>
  );
}
