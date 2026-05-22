import { useQueryParams } from '../hooks/useQueryParams';

interface TabProps {
  label: string;
  value: string | null;
}

interface Props {
  prop: string;
  defaultValue: string;
  tabs: TabProps[];
}

export function QueryTabs({ prop, defaultValue, tabs }: Props) {
  const { queryParams, setQueryParams } = useQueryParams();

  const current = queryParams[prop] || defaultValue;

  const handleClick = (value: TabProps['value']) => {
    setQueryParams({ [prop]: value });
  };

  return (
    <div className="flex items-center shadow-xs p-1 bg-white rounded-lg text-sm border border-neutral-200 text-neutral-500">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleClick(tab.value)}
          className={`rounded-lg p-1 h-full ${(tab.value || '') === current ? 'bg-emerald-300/10 text-emerald-500 border-emerald-100' : 'hover:text-black border-transparent'} border transition-colors`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
