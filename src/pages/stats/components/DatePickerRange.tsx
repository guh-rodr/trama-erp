import { DateRange, Range, StaticRange } from 'react-date-range';

import { toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

import { CalendarDotsIcon } from '@phosphor-icons/react';
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isSameDay,
  Locale,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { captalizeFirstLetter } from '../../../functions/captalizeFirstLetter';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useQueryParams } from '../../../hooks/useQueryParams';

type ExtendedStaticRange = StaticRange & { key: string };

const customPtBR: Locale = {
  ...ptBR,
  localize: {
    ...ptBR.localize!,
    day: (n) => {
      const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return dias[n];
    },
  },
};

const headerOptions: ExtendedStaticRange[] = [
  {
    label: 'Hoje',
    key: 'today',
    isSelected: () => true,
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: 'Ontem',
    key: 'yesterday',
    isSelected: () => false,
    range: () => ({
      startDate: startOfDay(addDays(new Date(), -1)),
      endDate: endOfDay(addDays(new Date(), -1)),
    }),
  },
  {
    label: 'Esta Semana',
    key: 'week',
    isSelected: () => false,
    range: () => ({
      startDate: startOfWeek(new Date(), { locale: ptBR }),
      endDate: endOfWeek(new Date(), { locale: ptBR }),
    }),
  },
  {
    label: 'Este Mês',
    key: 'month',
    isSelected: () => false,
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Este Ano',
    key: 'year',
    isSelected: () => false,
    range: () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
    }),
  },
];

export function DatePickerRange() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { queryParams, setQueryParams } = useQueryParams();
  const [canShowPicker, setCanShowPicker] = useState(false);

  const startDateStr = queryParams.startDate;
  const endDateStr = queryParams.endDate;

  const defaultStartDate = startDateStr ? parseISO(startDateStr) : toZonedTime(new Date(), 'America/Sao_Paulo');
  const defaultEndDate = endDateStr ? parseISO(endDateStr) : toZonedTime(new Date(), 'America/Sao_Paulo');

  const [state, setState] = useState<Range[]>([
    {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      key: 'selection',
    },
  ]);

  const isActive = (option: StaticRange) => {
    const { startDate, endDate } = option.range();
    return isSameDay(startDate!, state[0].startDate!) && isSameDay(endDate!, state[0].endDate!);
  };

  useClickOutside(containerRef, () => {
    if (canShowPicker) {
      setCanShowPicker(false);

      const dateState = state[0];

      setState([
        {
          ...dateState,
          startDate: defaultStartDate,
          endDate: defaultEndDate,
        },
      ]);
    }
  });

  const handleApply = () => {
    const { startDate, endDate } = state[0];

    if (!startDate || !endDate) return;

    const selectedHeaderOption = headerOptions.find((opt) => {
      const range = opt.range();
      return isSameDay(startDate, range.startDate!) && isSameDay(endDate, range.endDate!);
    });

    setQueryParams({
      startDate: format(startOfDay(startDate!), 'yyyy-MM-dd'),
      endDate: format(endOfDay(endDate!), 'yyyy-MM-dd'),
      period: selectedHeaderOption ? selectedHeaderOption.key : null,
    });

    setCanShowPicker(false);
  };

  const formattedStartedAt = format(state[0].startDate!, "dd 'de' MMM, yyyy", {
    locale: ptBR,
  });
  const formattedEndAt = format(state[0].endDate!, "dd 'de' MMM, yyyy", {
    locale: ptBR,
  });

  return (
    <div ref={containerRef} className="relative flex">
      <div className="relative !select-none">
        <button
          className="flex items-center gap-2 font-medium bg-white rounded-[10px] border border-neutral-200 p-2.5 text-sm shadow-xs outline-none hover:bg-neutral-50 transition-colors"
          onClick={() => setCanShowPicker(true)}
        >
          <CalendarDotsIcon weight="duotone" size={16} className="text-neutral-500" />
          {formattedStartedAt === formattedEndAt ? (
            formattedStartedAt
          ) : (
            <>
              {captalizeFirstLetter(formattedStartedAt)} {' '} – {' '} {captalizeFirstLetter(formattedEndAt)}
            </>
          )}
        </button>
      </div>
      {canShowPicker && (
        <div className="absolute mt-12 top-0 rounded-lg shadow-lg overflow-hidden bg-white flex flex-col z-50">
          <div className="flex items-center gap-3 px-2 pb-2 text-sm m-2 z-50 border-b border-neutral-200">
            {headerOptions.map((option, i) => (
              <button
                key={i}
                onClick={() => setState([{ ...option.range(), key: 'selection' }])}
                className={`${isActive(option) ? 'text-black border-neutral-300 bg-neutral-100' : 'border-neutral-400 text-neutral-500 hover:text-black'} px-3 py-1 h-fit rounded-2xl border transition-colors`}
              >
                {option.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleApply}
              className="bg-emerald-300/10 mr-0 ml-auto border border-emerald-100 text-emerald-500 text-sm px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:bg-emerald-100 transition-colors"
            >
              Aplicar
            </button>
          </div>
          <DateRange
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={state}
            direction="horizontal"
            locale={customPtBR}
            rangeColors={['#00bc7d']}
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            classNames={{
              monthAndYearPickers: '!hidden',
              monthName: '!text-center !text-neutral-800',
              nextPrevButton: '!mt-22',
              calendarWrapper: '!-mt-17',
              dayNumber: '!font-normal',
            }}
          />
        </div>
      )}
    </div>
  );
}
