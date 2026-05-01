import { PencilLineIcon, TrashIcon } from '@phosphor-icons/react';

interface Props {
  name: string;
  itemsCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductCard({ name, itemsCount, onEdit, onDelete }: Props) {
  return (
    <div className="relative border border-l-4 border-l-gray-400 border-neutral-200/50 bg-white p-3 rounded-lg shadow group flex gap-4 items-center justify-between min-w-[250px]">
      <div className="flex flex-col m-0">
        <span className="text-neutral-800 text-sm font-semibold">{name}</span>
        <span className="text-sm text-neutral-500">
          {itemsCount} {itemsCount > 1 ? 'itens vendidos' : 'item vendido'}
        </span>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center">
        <button
          type="button"
          onClick={onEdit}
          className="text-blue-500 size-fit p-2 block rounded-lg hover:bg-blue-100/50 transition-colors m-0"
        >
          <PencilLineIcon weight="duotone" size={16} />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="text-red-500 size-fit p-2 block rounded-lg hover:bg-red-100/50 transition-colors m-0"
        >
          <TrashIcon weight="duotone" size={16} />
        </button>
      </div>
    </div>
  );
}
