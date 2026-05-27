import { CircleNotchIcon, FunnelSimpleIcon, FunnelSimpleXIcon, PlusIcon } from '@phosphor-icons/react';
import { useReducer, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useClickOutside } from '../../hooks/useClickOutside';
import { FilterFieldProps, FilterForm, FilterItem, FilterLogicalOp } from '../../types/filters';
import { FilterRow } from './FilterRow';

interface FilterState {
  draft: FilterForm;
}

export type FilterAction =
  | { type: 'add' }
  | { type: 'remove'; index: number }
  | { type: 'update'; index: number; payload: Partial<FilterItem> }
  | { type: 'update_logical'; logical: FilterLogicalOp }
  | { type: 'clear' }
  | { type: 'set'; filter: FilterForm };

function reducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'add':
      return {
        draft: {
          ...state.draft,
          filters: [...state.draft.filters, { field: '', operator: '' }],
        },
      };
    case 'remove':
      return {
        draft: {
          ...state.draft,
          filters: state.draft.filters.filter((_, i) => i !== action.index),
        },
      };
    case 'update':
      return {
        draft: {
          ...state.draft,
          filters: state.draft.filters.map((f, i) => (i === action.index ? { ...f, ...action.payload } : f)),
        },
      };
    case 'update_logical':
      return {
        draft: {
          ...state.draft,
          logical: action.logical,
        },
      };
    case 'clear':
      return {
        draft: {
          ...state.draft,
          filters: [],
        },
      };
    case 'set':
      return {
        draft: action.filter,
      };
    default:
      return state;
  }
}

interface Props {
  filter: FilterForm;
  fields: FilterFieldProps[];
  onApply: (filter: FilterForm) => void;
  isLoading?: boolean;
}

export function Filter({ filter, fields, onApply, isLoading }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [state, dispatch] = useReducer(reducer, { draft: filter });

  const containerRef = useRef<HTMLDivElement>(null);
  const appliedFiltersCount = filter.filters.length;

  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const handleToggleVisibility = () => {
    const isNowOpen = !isOpen;
    setIsOpen(isNowOpen);

    if (isNowOpen) {
      dispatch({ type: 'set', filter });
    }
  };

  const handleApply = () => {
    if (state.draft.filters.some((f) => !f.field || !f.operator || !f.value)) {
      toast.error('Há filtros com campos vazios', { position: 'top-right' });
      return;
    }

    onApply?.(state.draft);
    setIsOpen(false);
  };

  const handleClear = () => {
    if (state.draft.filters.length === 0) return;

    dispatch({ type: 'clear' });
  };

  return (
    <div ref={containerRef} className="relative flex size-full">
      <div className="relative">
        <button
          type="button"
          id="btn"
          disabled={isLoading}
          onClick={handleToggleVisibility}
          className="flex h-full w-11 justify-center items-center shadow-sm bg-white rounded-lg text-sm border border-neutral-200 text-neutral-500 disabled:opacity-50"
        >
          <FunnelSimpleIcon size={18} weight="bold" />
        </button>

        {isLoading && (
          <span className="absolute top-0 right-0 bg-neutral-200 text-neutral-600 rounded-full px-2 text-xs py-1.5 -mt-2 -mr-2">
            <CircleNotchIcon className="animate-spin" size={14} weight="bold" />
          </span>
        )}

        {!isLoading && appliedFiltersCount > 0 && (
          <span className="absolute top-0 right-0 bg-indigo-500 text-white rounded-full px-2 text-xs py-0.5 -mt-2 -mr-2">
            {appliedFiltersCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute mt-12 space-y-2 left-0 top-0 bg-white rounded-lg shadow-lg p-2 border border-neutral-200 z-40">
          {state.draft.filters.length ? (
            state.draft.filters.map((filter, index) => {
              return (
                <FilterRow
                  key={index}
                  filter={filter}
                  index={index}
                  fields={fields}
                  value={filter.value}
                  currentLogical={state.draft.logical}
                  dispatch={dispatch}
                />
              );
            })
          ) : (
            <span className="text-center text-nowrap w-full block text-neutral-400 text-sm pt-2 px-2">
              Não há filtros, comece adicionando um
            </span>
          )}

          <div className="flex gap-8 justify-between border-t border-neutral-200 mt-4 pt-2 px-1">
            <div className="flex gap-3">
              <button
                className="text-sm whitespace-nowrap text-emerald-500 transition-opacity cursor-pointer hover:opacity-60 flex items-center gap-1"
                type="button"
                onClick={() => dispatch({ type: 'add' })}
              >
                <PlusIcon weight="bold" /> Novo filtro
              </button>

              <button
                className="text-sm whitespace-nowrap text-blue-500 transition-opacity cursor-pointer hover:opacity-60 flex items-center gap-1"
                type="button"
                onClick={handleClear}
              >
                <FunnelSimpleXIcon weight="bold" /> Limpar tudo
              </button>
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="bg-emerald-300/10 text-emerald-500 border border-emerald-100 text-sm px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:bg-emerald-100 transition-colors"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
