import { Button } from '../../../components/Button';
import { useDialog } from '../../../contexts/dialog/dialog-context';

interface Props {
  onConfirm: () => void;
  newType: 'simple' | 'variable';
  quantity?: number;
}

export function ProductTypeConversion({ onConfirm, newType, quantity }: Props) {
  const { closeDialog } = useDialog();

  return (
    <div className="space-y-12">
      {newType === 'variable' && (
        <div className="space-y-3">
          <p>
            Esse produto atualmente possui <strong>{quantity} und.</strong> em estoque. Ao confirmar, as seguintes ações
            serão feitas:
          </p>

          <p>
            • O estoque do produto atual será zerado
            <br />• O produto atual será arquivado permantenemente
          </p>

          <p>Essa operação não poderá ser desfeita.</p>
        </div>
      )}

      {newType === 'simple' && (
        <div className="space-y-3">
          <p>
            Esse produto possui variantes com estoque ativo, totalizando <strong>{quantity} und.</strong> Ao confirmar,
            as seguintes ações serão feitas:
          </p>
          <p>
            • O estoque de todas as variantes serão zerados
            <br />• Variantes com vendas serão <strong>arquivadas</strong>
            <br />• Variantes sem vendas serão <strong>excluídas</strong>
          </p>

          <p>Essa operação não poderá ser desfeita.</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 !space-y-0">
        <Button className="flex-1 text-nowrap" type="button" variant="outline" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button
          className="flex-1 text-nowrap"
          type="button"
          onClick={() => {
            closeDialog();
            onConfirm();
          }}
        >
          Converter para {newType === 'simple' ? 'simples' : 'variado'}
        </Button>
      </div>
    </div>
  );
}
