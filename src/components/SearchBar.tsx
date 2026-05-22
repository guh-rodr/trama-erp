import { CircleNotchIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useTableParams } from '../hooks/useTableParams';
import { Input } from './Input';

interface Props {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export function SearchBar({ placeholder, onSearch }: Props) {
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { params, setParams } = useTableParams();

  const debouncedOnChange = useDebounce((value: string) => {
    setIsTyping(false);
    setParams({ search: value });
    onSearch?.(value);
  }, 700);

  useEffect(() => {
    if (!params.search && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [params.search]);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (!isTyping) {
      setIsTyping(true);
    }

    debouncedOnChange(value);
  };

  return (
    <div className="relative">
      {isTyping ? (
        <CircleNotchIcon className="text-neutral-400 absolute inset-0 mt-[13px] ml-3 animate-spin" weight="bold" />
      ) : (
        <MagnifyingGlassIcon className="text-neutral-400 absolute inset-0 mt-[13px] ml-3" weight="bold" />
      )}

      <Input
        ref={inputRef}
        onChange={handleChangeInput}
        defaultValue={params.search}
        className="min-w-sm pl-9 pr-4 placeholder-neutral-400 font-normal"
        placeholder={placeholder}
      />
    </div>
  );
}
