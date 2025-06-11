
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChartConfig, SeriesItem } from "@/types/chart";

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

  const getGroupedSeries = () => {
    const grouped = new Map<string, SeriesItem[]>();
    series.forEach(s => {
      if (!grouped.has(s.variable)) {
        grouped.set(s.variable, []);
      }
      grouped.get(s.variable)!.push(s);
    });
    return grouped;
  };

  const groupedSeries = getGroupedSeries();

  if (config.groupByVersion) {
    // Original flat view
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Series Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure individual series by version
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {series.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => changeSeriesColor(s.id, e.target.value)}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <div>
                    <Label className="text-sm font-medium">
                      {s.variable} ({s.version})
                    </Label>
                  </div>
                </div>
                <Switch
                  checked={s.visible}
                  onCheckedChange={() => toggleSeriesVisibility(s.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grouped hierarchical view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Series Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure series grouped by variable
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from(groupedSeries.entries()).map(([variable, variableSeries]) => (
            <div key={variable} className="space-y-3">
              <div className="font-medium text-foreground text-sm border-b border-border pb-2">
                {variable}
              </div>
              <div className="space-y-2 pl-4">
                {variableSeries.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-md border border-border/50 hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={s.color}
                        onChange={(e) => changeSeriesColor(s.id, e.target.value)}
                        className="w-6 h-6 rounded border border-border cursor-pointer"
                      />
                      <Label className="text-sm text-muted-foreground">
                        {s.version}
                      </Label>
                    </div>
                    <Switch
                      checked={s.visible}
                      onCheckedChange={() => toggleSeriesVisibility(s.id)}
                      className="scale-75"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 bg-muted/30 p-3 rounded-md">
          <p className="text-xs text-muted-foreground">
            💡 In grouped mode, the chart shows one line per variable using data from the highest priority visible version
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
