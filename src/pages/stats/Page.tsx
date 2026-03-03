import { DashboardLayout } from '../../components/DashboardLayout';
import { ErrorNotification } from '../../components/ErrorNotification';
import { QueryTabs } from '../../components/QueryTabs';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useFetchStats } from '../../hooks/useStats';
import { useStatsParams } from '../../hooks/useStatsParams';
import { CardsStats } from './components/CardsStats';
import { DatePickerRange } from './components/DatePickerRange';
import { StatsSkeletonLoading } from './components/StatsSkeletonLoading';
import { TopCategoriesChart } from './components/TopCategoriesChart';
import { ValuesChart } from './components/ValuesChart';

export function StatsPage() {
  usePageTitle('Estatísticas');

  const { method, ...params } = useStatsParams();
  const { data, isLoading, isError } = useFetchStats({
    method,
    ...params,
  });

  return (
    <DashboardLayout title="Estatísticas">
      <div className="flex gap-3">
        <DatePickerRange />

        <QueryTabs
          prop="method"
          defaultValue={method}
          tabs={[
            { label: 'Regime de caixa', value: 'cash_basis' },
            { label: 'Regime de competência', value: 'accrual_basis' },
          ]}
        />
      </div>

      {isLoading && <StatsSkeletonLoading />}
      {isError && <ErrorNotification />}

      {data && (
        <>
          <div className="flex items-stretch gap-4">
            <CardsStats cards={data.cards} method={method} />
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 flex-1 min-w-[calc(3/5*100%-6px)] bg-white rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">
                {method === 'cash_basis' ? 'Entradas x Saídas' : 'Faturamento x Custos'}
              </h2>

              <ValuesChart chart={data.metricsChart} method={method} />
            </div>

            <div className="p-4 w-full self-stretch  bg-white rounded-xl shadow-sm text-center">
              <h2 className="text-lg font-semibold">Categorias Populares</h2>
              <span className="text-neutral-500 text-sm">Por item vendido</span>

              <TopCategoriesChart data={data.topCategories} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
