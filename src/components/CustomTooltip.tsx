
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
    // Filter payload to only show the hovered series
    const hoveredEntry = payload[0]; // Only show the first (hovered) entry
    
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-4">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          {hoveredEntry && (
            <div className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: hoveredEntry.color }}
              />
              {(() => {
                const dataKey = hoveredEntry.dataKey;
                const matchingSeries = series.find(s => 
                  `${s.variable}-${s.version}` === dataKey
                );
                
                return (
                  <>
                    <span className="text-muted-foreground">
                      {matchingSeries ? `${matchingSeries.variable} (${matchingSeries.version})` : dataKey}:
                    </span>
                    <span className="font-medium">${hoveredEntry.value.toLocaleString()}</span>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
