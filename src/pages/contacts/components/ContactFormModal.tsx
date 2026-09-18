import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { Textarea } from '../../../components/Textarea';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useContact, useCreateContact, useUpdateContact } from '../../../hooks/useContacts';
import { ContactForm } from '../../../types/contact';

interface Props {
  defaultContactId?: string;
}

export function ContactFormModal({ defaultContactId = '' }: Props) {
  const isEditMode = !!defaultContactId;

  const { data: defaultContact, isFetching } = useContact({ id: defaultContactId });

  const { closeDialog } = useDialog();
  const { control, handleSubmit, register } = useForm<ContactForm>({
    values: defaultContact,
  });

  const { mutate: createContactMutate, isPending: isCreating } = useCreateContact();
  const { mutate: updateContactMutate, isPending: isUpdating } = useUpdateContact();

  const onSubmit: SubmitHandler<ContactForm> = (data) => {
    if (isEditMode) {
      updateContactMutate(data, {
        onSuccess: () => closeDialog(),
      });
    } else {
      createContactMutate(data, {
        onSuccess: () => closeDialog(),
      });
    }
  };

  if (isFetching) {
    return <LoadingNotification />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="space-y-4 h-full">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register('name', {
              required: 'O nome do contato é obrigatório.',
            })}
          />
        </div>

        <div>
          <Label htmlFor="type">Tipo</Label>
          <Controller
            control={control}
            name="type"
            defaultValue="CUSTOMER"
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                readOnly
                value={field.value}
                onChangeOption={field.onChange}
                options={[
                  { label: 'Cliente', value: 'CUSTOMER' },
                  { label: 'Fornecedor', value: 'SUPPLIER' },
                ]}
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            {...register('phone')}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
          />
        </div>

        <div>
          <Label htmlFor="doc">CPF / CNPJ</Label>
          <Input id="doc" {...register('document')} />
        </div>

        <div>
          <Label htmlFor="note">Nota</Label>
          <Textarea id="note" rows={4} {...register('note')} />
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <Button type="button" variant="outline" className="w-full mt-4 text-center" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button type="submit" isLoading={isCreating || isUpdating} className="w-full mt-4 text-center">
          {isEditMode ? 'Salvar alterações' : 'Registrar contato'}
        </Button>
      </div>
    </form>
  );
}
