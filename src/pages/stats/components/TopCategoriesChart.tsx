import { SmileySadIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../../../components/Chart';
import { StatsResponse } from '../../../types/stats';

const COLORS = ['#4A90E2', '#7BAAF7', '#B8D4F5', 'blue', 'turquoise'];

interface Props {
  data: StatsResponse['topCategories'];
}

export function TopCategoriesChart({ data }: Props) {
  const { chartData, chartConfig } = useMemo(() => {
    const config: ChartConfig = {};

    const processedData = data.map((item, index) => {
      const color = COLORS[index % COLORS.length];

      config[item.category] = {
        label: item.category,
        color: color,
      };

      return {
        ...item,
        fill: color,
      };
    });

    return { chartData: processedData, chartConfig: config };
  }, [data]);

  if (!data.length) {
    return (
      <div className="w-full flex gap-4 flex-col items-center justify-center text-neutral-400 my-36">
        <SmileySadIcon weight="light" size={120} className="text-neutral-300" />
        <p>Sem dados para exibir.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="mt-8">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />

        <ChartLegend content={<ChartLegendContent className="translate-y-8" />} />

        <Pie
          data={chartData}
          dataKey="count"
          nameKey="category"
          paddingAngle={2}
          cornerRadius={4}
          innerRadius="60%"
          outerRadius="80%"
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  );
}
