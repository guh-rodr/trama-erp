import { useState } from 'react';
import { ProductInfoMovements } from './ProductInfoMovements';

interface Props {
  id: string;
}

type Tab = 'stock-movements';

export function ProductInfoDrawer({ id }: Props) {
  const [tab, setTab] = useState<Tab>('stock-movements');

  return (
    <div>
      <div className="flex gap-5 border-b pt-4 text-neutral-600 border-neutral-300">
        <button
          type="button"
          onClick={() => setTab('stock-movements')}
          data-enabled={tab === 'stock-movements'}
          className="border-b-2 py-1 border-transparent data-enabled:border-black data-enabled:text-black"
        >
          Hist. Movimentações
        </button>
      </div>

      {tab === 'stock-movements' && <ProductInfoMovements id={id} />}
    </div>
  );
}
