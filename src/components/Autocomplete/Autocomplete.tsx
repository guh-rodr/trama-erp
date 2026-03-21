import { CaretRightIcon, CircleNotchIcon } from '@phosphor-icons/react';
import { QueryStatus } from '@tanstack/react-query';
import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../Input';
import { AutocompleteAction } from './AutocompleteAction';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { AutocompleteOption } from './AutocompleteOption';

export interface Option {
  label: string;
  value: string;
  group?: string;
}

interface Props {
  className?: string;
  placeholder?: string;
  options: Option[];
  status?: QueryStatus;
  readOnly?: boolean;
  disabled?: boolean;
  showActionsOnEmpty?: boolean;
  value?: string;
  onChangeInput?: (value: string) => void;
  onChangeOption?: (value: string) => void;
  renderOption?: (option: Option) => ReactNode;
  onOpen?: () => void;
  children?: ReactNode;
}

export function Autocomplete({
  className,
  placeholder,
  options,
  status = 'success',
  readOnly,
  disabled,
  showActionsOnEmpty,
  value,
  onChangeInput,
  onChangeOption,
  renderOption,
  onOpen,
  children,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(() => options.find((opt) => opt.value === value), [options, value]);
  const [lastOption, setLastOption] = useState<Option | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBlurOrClickOutside = () => {
    if (showDropdown) {
      setShowDropdown(false);
    }

    if (selectedOption) {
      setInputValue(selectedOption.label);
      setDebouncedValue(selectedOption.label);
      return;
    }

    if (lastOption && lastOption.value === value) {
      setInputValue(lastOption.label);
      setDebouncedValue(lastOption.label);
      return;
    }

    setInputValue(value ?? '');
    setDebouncedValue(value ?? '');
  };

  useClickOutside(containerRef, () => {
    if (showDropdown) {
      handleBlurOrClickOutside();
    }
  });

  const getOptionInputValue = (option: Option) => {
    const groupName = option.group !== 'default' && option.group;
    const inputValue = groupName ? `[${groupName}] ${option.label}` : option.label;

    return inputValue;
  };

  const handleClickOption = (option: Option) => {
    const inputValue = getOptionInputValue(option);

    onChangeOption?.(option.value);
    setInputValue(inputValue);
    setDebouncedValue(inputValue);
    setShowDropdown(false);
  };

  const groups = useMemo(() => {
    const isControlledInput = !!onChangeInput || readOnly;

    const filterOptions = () =>
      options.filter(
        ({ group, label }) =>
          group?.toLowerCase().startsWith(debouncedValue.toLowerCase()) ||
          label.toLowerCase().startsWith(debouncedValue.toLowerCase()),
      );

    const groupedOptions = Object.groupBy(
      isControlledInput ? options : filterOptions(),
      (opt) => opt.group ?? 'default',
    );

    return Object.entries(groupedOptions).map(([groupName, options]) => ({
      name: groupName,
      options: options,
    }));
  }, [debouncedValue, options, onChangeInput, readOnly]);

  const debouncedOnChange = useDebounce((value: string) => {
    setIsTyping(false);
    setDebouncedValue(value);
    onChangeInput?.(value);
  }, 700);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);

    if (!isTyping) {
      setIsTyping(true);
    }

    debouncedOnChange(value);
  };

  useEffect(() => {
    if (selectedOption) {
      setLastOption(selectedOption);

      if (document.activeElement !== inputRef.current) {
        const inputValue = getOptionInputValue(selectedOption);

        setInputValue(inputValue);
        setDebouncedValue(inputValue);
      }
    }
  }, [selectedOption]);

  const handleOpenDropdown = () => {
    setShowDropdown(true);
    onOpen?.();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          className={className}
          readOnly={readOnly}
          disabled={disabled}
          value={inputValue}
          onChange={handleChangeInput}
          placeholder={placeholder}
          onFocus={handleOpenDropdown}
        />

        <CaretRightIcon
          weight="bold"
          size={14}
          className={`absolute inset-0 my-auto mr-2 ml-auto text-neutral-400 pointer-events-none transition-all ${showDropdown ? 'rotate-90' : ''}`}
        />
      </div>

      {showDropdown && (
        <AutocompleteDropdown>
          {(status === 'pending' || isTyping) && (
            <span className="py-2 px-3 text-neutral-500 flex items-center justify-center gap-2">
              <CircleNotchIcon className="animate-spin" />
              Buscando dados...
            </span>
          )}

          {status === 'error' && !isTyping && (
            <span className="text-red-400 py-2 px-3 text-center">Erro ao carregar os dados</span>
          )}

          {status === 'success' && !isTyping && (
            <>
              {groups.length === 0 && (
                <span className="py-2 px-3 text-neutral-500 text-center">Nenhuma opção disponível</span>
              )}

              {groups.map((group) => (
                <div key={group.name}>
                  {group.name !== 'default' && (
                    <span className="first:pt-1 font-semibold text-neutral-800 py-0.5 px-2 w-full block text-left">
                      {group.name}
                    </span>
                  )}

                  {group.options?.map((opt) => (
                    <AutocompleteOption
                      key={opt.value}
                      value={opt.value}
                      onClick={() => handleClickOption(opt)}
                      isGrouped={group.name !== 'default'}
                    >
                      {renderOption ? renderOption(opt) : opt.label}
                    </AutocompleteOption>
                  ))}
                </div>
              ))}

              {groups.length === 0 && showActionsOnEmpty && children}
              {!showActionsOnEmpty && children}
            </>
          )}
        </AutocompleteDropdown>
      )}
    </div>
  );
}

Autocomplete.Action = AutocompleteAction;
