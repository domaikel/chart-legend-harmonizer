
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChartConfig, SeriesItem } from "@/types/chart";
import { Badge } from "@/components/ui/badge";

interface SeriesPanelProps {
  series: SeriesItem[];
  config: ChartConfig;
  onSeriesChange: (series: SeriesItem[]) => void;
}

export const SeriesPanel = ({ series, config, onSeriesChange }: SeriesPanelProps) => {
  const toggleSeriesVisibility = (id: string) => {
    const updated = series.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    onSeriesChange(updated);
  };

  const changeSeriesColor = (id: string, color: string) => {
    const updated = series.map(s => 
      s.id === id ? { ...s, color } : s
    );
    onSeriesChange(updated);
  };

  const getDisplaySeries = () => {
    if (config.groupByVersion) {
      return series;
    } else {
      // Group by variable - show only one entry per variable
      const grouped = new Map<string, SeriesItem>();
      series.forEach(s => {
        if (!grouped.has(s.variable) || s.version === "Actuals") {
          grouped.set(s.variable, s);
        }
      });
      return Array.from(grouped.values());
    }
  };

  const displaySeries = getDisplaySeries();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Series Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          {config.groupByVersion 
            ? "Configure individual series by version" 
            : "Configure unified variables (version grouping active)"
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displaySeries.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={s.color}
                  onChange={(e) => {
                    if (config.groupByVersion) {
                      changeSeriesColor(s.id, e.target.value);
                    } else {
                      // In grouped mode, update all series of the same variable
                      const updated = series.map(item => 
                        item.variable === s.variable ? { ...item, color: e.target.value } : item
                      );
                      onSeriesChange(updated);
                    }
                  }}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <div>
                  <Label className="text-sm font-medium">
                    {config.groupByVersion ? s.variable : s.variable}
                  </Label>
                  {config.groupByVersion && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {s.version}
                    </Badge>
                  )}
                </div>
              </div>
              <Switch
                checked={s.visible}
                onCheckedChange={() => {
                  if (config.groupByVersion) {
                    toggleSeriesVisibility(s.id);
                  } else {
                    // In grouped mode, toggle all series of the same variable
                    const updated = series.map(item => 
                      item.variable === s.variable ? { ...item, visible: !s.visible } : item
                    );
                    onSeriesChange(updated);
                  }
                }}
              />
            </div>
          ))}
        </div>
        
        {!config.groupByVersion && (
          <div className="mt-4 bg-muted/30 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">
              ⚡ Grouped mode: Changes apply to all versions of each variable
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
