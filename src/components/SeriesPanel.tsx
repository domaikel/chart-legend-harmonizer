
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
    if (config.groupByVersion) {
      // Original mode - change individual series color
      const updated = series.map(s => 
        s.id === id ? { ...s, color } : s
      );
      onSeriesChange(updated);
    } else {
      // Grouped mode - change color for all versions of the variable
      const targetSeries = series.find(s => s.id === id);
      if (targetSeries) {
        const updated = series.map(s => 
          s.variable === targetSeries.variable ? { ...s, color } : s
        );
        onSeriesChange(updated);
      }
    }
  };

  const toggleVariableVisibility = (variable: string) => {
    const updated = series.map(s => 
      s.variable === variable ? { ...s, visible: !s.visible } : s
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

  // Grouped mode - show one color per variable
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Series Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure series grouped by variable
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from(groupedSeries.entries()).map(([variable, variableSeries]) => {
            const firstSeries = variableSeries[0];
            const allVisible = variableSeries.every(s => s.visible);
            const someVisible = variableSeries.some(s => s.visible);
            
            return (
              <div key={variable} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={firstSeries.color}
                    onChange={(e) => changeSeriesColor(firstSeries.id, e.target.value)}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <div>
                    <Label className="text-sm font-medium">
                      {variable}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {variableSeries.length} versions
                    </p>
                  </div>
                </div>
                <Switch
                  checked={allVisible}
                  onCheckedChange={() => toggleVariableVisibility(variable)}
                  className={someVisible && !allVisible ? "opacity-50" : ""}
                />
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 bg-muted/30 p-3 rounded-md">
          <p className="text-xs text-muted-foreground">
            💡 In grouped mode, all versions of a variable share the same color and visibility setting
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
