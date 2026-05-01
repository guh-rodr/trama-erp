import { ArrowsClockwiseIcon } from '@phosphor-icons/react';
import { Card } from '../../../components/Card';

interface Props {
  title: string;
  description: string;
  isCurrent?: boolean;
  isSelected?: boolean;
  mode: 'select' | 'static';
  onSelect?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ProductTypeCard({ title, description, isCurrent, isSelected, mode, onSelect, action }: Props) {
  const isSelectMode = mode === 'select';

  return (
    <Card
      className={`flex-1 rounded-xl p-4 border border-neutral-200 bg-white transition-colors ${isSelectMode ? 'cursor-pointer hover:border-emerald-300' : ''} ${isSelected ? '!border-emerald-300' : ''}`}
      onClick={onSelect}
    >
      <div className="flex justify-between">
        <span className="font-medium">{title}</span>
        <span
          className={`rounded-full px-2 bg-emerald-100/50 text-emerald-500 text-xs grid place-items-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0'}`}
        >
          Atual
        </span>
      </div>
      <p className="text-neutral-500 text-sm">{description}</p>

      {action && (
        <button
          className="text-emerald-500 text-sm transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1 mt-4"
          type="button"
          onClick={action.onClick}
        >
          <ArrowsClockwiseIcon weight="bold" />
          {action.label}
        </button>
      )}
    </Card>
  );
}
