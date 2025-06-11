
import { ChartConfig, SeriesItem } from "@/types/chart";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  config: ChartConfig;
  series: SeriesItem[];
}

export const CustomTooltip = ({ active, payload, label, config, series }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-4">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => {
            const color = entry.color;
            const value = entry.value;
            const dataKey = entry.dataKey;
            
            // If grouped mode, show all versions for this variable
            if (!config.groupByVersion) {
              const variable = dataKey;
              const relatedSeries = series.filter(s => s.variable === variable && s.visible);
              
              return (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm text-foreground">{variable}</div>
                  {relatedSeries.map(s => {
                    const seriesDataKey = `${s.variable}-${s.version}`;
                    const seriesValue = entry.payload[seriesDataKey];
                    if (seriesValue !== undefined) {
                      return (
                        <div key={s.id} className="flex items-center gap-2 text-sm pl-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="text-muted-foreground">{s.version}:</span>
                          <span className="font-medium">${seriesValue.toLocaleString()}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            } else {
              // Original mode - show individual series
              const matchingSeries = series.find(s => 
                `${s.variable}-${s.version}` === dataKey
              );
              
              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-muted-foreground">
                    {matchingSeries ? `${matchingSeries.variable} (${matchingSeries.version})` : dataKey}:
                  </span>
                  <span className="font-medium">${value.toLocaleString()}</span>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }

  return null;
};
