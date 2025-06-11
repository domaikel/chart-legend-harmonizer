
import { ChartConfig, SeriesItem } from "@/types/chart";

interface CustomLegendProps {
  payload?: any[];
  config: ChartConfig;
  series: SeriesItem[];
}

export const CustomLegend = ({ payload, config, series }: CustomLegendProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border">
      {series.map((s) => (
        <div key={s.id} className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: s.color }}
          />
          <span className="text-sm text-foreground">
            {config.groupByVersion ? `${s.variable} (${s.version})` : s.variable}
          </span>
        </div>
      ))}
    </div>
  );
};
