import { CircleNotchIcon, FunnelSimpleIcon, FunnelSimpleXIcon, PlusIcon } from '@phosphor-icons/react';
import { forwardRef, useEffect, useImperativeHandle, useReducer, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useQueryParams } from '../../hooks/useQueryParams';
import { FilterFieldProps, FilterForm, FilterHandle, FilterItem, FilterLogicalOp } from '../../types/filters';
import { FilterRow } from './FilterRow';

interface FilterState {
  draft: FilterForm;
  applied: FilterForm;
}

export type FilterAction =
  | { type: 'add' }
  | { type: 'remove'; index: number }
  | { type: 'update'; index: number; payload: Partial<FilterItem> }
  | { type: 'update_logical'; logical: FilterLogicalOp }
  | { type: 'apply' }
  | { type: 'open' }
  | { type: 'clear' }
  | { type: 'set_default'; filter: FilterForm };

function reducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        draft: {
          ...state.draft,
          filters: [...state.draft.filters, { field: '', operator: '' }],
        },
      };
    case 'remove':
      return {
        ...state,
        draft: {
          ...state.draft,
          filters: state.draft.filters.filter((_, i) => i !== action.index),
        },
      };
    case 'update':
      return {
        ...state,
        draft: {
          ...state.draft,
          filters: state.draft.filters.map((f, i) => (i === action.index ? { ...f, ...action.payload } : f)),
        },
      };
    case 'update_logical':
      return {
        ...state,
        draft: {
          ...state.draft,
          logical: action.logical,
        },
      };
    case 'apply':
      return {
        ...state,
        applied: state.draft,
      };
    case 'open':
      return {
        ...state,
        draft: state.applied.filters.length > 0 ? state.applied : state.draft,
      };
    case 'clear':
      return {
        ...state,
        draft: {
          ...state.draft,
          filters: [],
        },
      };
    case 'set_default':
      return {
        draft: state.draft,
        applied: action.filter,
      };
    default:
      return state;
  }
}

interface Props {
  fields: FilterFieldProps[];
  onApply: (filter: FilterForm) => void;
  isLoading?: boolean;
  defaultApplied?: FilterForm;
}

export const Filter = forwardRef<FilterHandle, Props>(function Filter(
  { fields, onApply, isLoading, defaultApplied },
  ref,
) {
  const { setQueryParams } = useQueryParams();
  const [isOpen, setIsOpen] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    draft: { filters: [], logical: 'AND' },
    applied: { filters: [], logical: 'AND' },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const appliedCountRef = useRef(state.applied.filters.length);
  appliedCountRef.current = state.applied.filters.length;

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (appliedCountRef.current === 0) return;

        toast('Os filtros aplicados foram resetados');

        dispatch({ type: 'set_default', filter: { filters: [], logical: 'AND' } });
        onApply?.({ filters: [], logical: 'AND' });
      },
    }),
    [onApply, appliedCountRef],
  );

  useEffect(() => {
    if (!defaultApplied || defaultApplied.filters.length === 0) return;

    dispatch({ type: 'set_default', filter: defaultApplied });
    onApply(defaultApplied);
  }, [defaultApplied, onApply]);

  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const handleToggleVisibility = () => {
    const isNowOpen = !isOpen;
    setIsOpen(isNowOpen);

    if (isNowOpen) {
      dispatch({ type: 'open' });
    }
  };

  const handleApply = () => {
    if (state.draft.filters.some((f) => !f.field || !f.operator || !f.value)) {
      toast.error('Há filtros com campos vazios', { position: 'top-right' });
      return;
    }

    dispatch({ type: 'apply' });
    onApply?.(state.draft);
    setIsOpen(false);
    setQueryParams({ page: 1, search: null });
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

        {!isLoading && appliedCountRef.current > 0 && (
          <span className="absolute top-0 right-0 bg-indigo-500 text-white rounded-full px-2 text-xs py-0.5 -mt-2 -mr-2">
            {appliedCountRef.current}
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
});
