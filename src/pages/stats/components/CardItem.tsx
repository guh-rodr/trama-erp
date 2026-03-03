import { Icon } from '@phosphor-icons/react';

interface Props {
  icon: Icon;
  label: string;
  value: string | number;
}

export function CardItem({ icon: Icon, label, value }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 w-sm text-neutral-500 flex gap-4 flex-col justify-between">
      <span className="flex items-center gap-2 text-sm break-words">
        <Icon size={16} />
        {label}
      </span>

      <span
        className={`font-semibold ${value.toString().startsWith('-') ? 'text-red-500' : 'text-neutral-800'} text-xl block`}
      >
        {value}
      </span>
    </div>
  );
}
