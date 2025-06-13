import { ChartConfig, SeriesItem } from "@/types/chart";

interface CustomLegendProps {
  payload?: any[];
  config: ChartConfig;
  series: SeriesItem[];
  chartSeries?: SeriesItem[];
}

export const CustomLegend = ({ payload, config, series, chartSeries }: CustomLegendProps) => {
  // This component is no longer needed since we're using Highcharts built-in legend
  // But keeping it for potential future custom legend requirements
  return null;
};
