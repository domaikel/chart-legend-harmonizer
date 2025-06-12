
import { ChartConfig, SeriesItem } from "@/types/chart";

interface CustomLegendProps {
  payload?: any[];
  config: ChartConfig;
  series: SeriesItem[];
  chartSeries?: SeriesItem[];
}

export const CustomLegend = ({ payload, config, series, chartSeries }: CustomLegendProps) => {
  if (config.groupByVersion) {
    // Original mode - show individual series
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border">
        {series.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: s.color }}
            />
            <span className="text-sm text-foreground">
              {s.variable} ({s.version})
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Grouped mode - show stacked dots for each variable
  const variableGroups = new Map<string, SeriesItem[]>();
  if (chartSeries) {
    chartSeries.forEach(s => {
      if (!variableGroups.has(s.variable)) {
        variableGroups.set(s.variable, []);
      }
      variableGroups.get(s.variable)!.push(s);
    });
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6 pt-4 border-t border-border">
      {Array.from(variableGroups.entries()).map(([variable, variableSeries]) => (
        <div key={variable} className="flex items-center gap-3">
          <div className="flex items-center">
            {variableSeries.map((s, index) => (
              <div 
                key={s.id}
                className="w-3 h-3 rounded-full border border-background"
                style={{ 
                  backgroundColor: s.color,
                  marginLeft: index > 0 ? '-6px' : '0',
                  zIndex: variableSeries.length - index
                }}
              />
            ))}
          </div>
          <span className="text-sm text-foreground">
            {variable}
          </span>
        </div>
      ))}
    </div>
  );
};
