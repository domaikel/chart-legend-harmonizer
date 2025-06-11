
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SeriesPanel } from "./SeriesPanel";
import { ChartConfig, SeriesItem } from "@/types/chart";

interface ChartSidebarProps {
  config: ChartConfig;
  series: SeriesItem[];
  onConfigChange: (config: Partial<ChartConfig>) => void;
  onSeriesChange: (series: SeriesItem[]) => void;
}

export const ChartSidebar = ({ config, series, onConfigChange, onSeriesChange }: ChartSidebarProps) => {
  return (
    <div className="w-80 bg-card border-r border-border h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Chart Settings</h2>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Legend Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-legend" className="text-sm font-medium">
                Show Legend
              </Label>
              <Switch
                id="show-legend"
                checked={config.showLegend}
                onCheckedChange={(checked) => onConfigChange({ showLegend: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="group-by-version" className="text-sm font-medium">
                  Group by Version
                </Label>
                <p className="text-xs text-muted-foreground">
                  {config.groupByVersion 
                    ? "Each version appears as separate legend entry" 
                    : "Variables are grouped under single legend entry"
                  }
                </p>
              </div>
              <Switch
                id="group-by-version"
                checked={config.groupByVersion}
                onCheckedChange={(checked) => onConfigChange({ groupByVersion: checked })}
              />
            </div>

            {!config.groupByVersion && (
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">
                  ℹ️ In grouped mode, legend items are unified by variable. Tooltips still show all version data.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <SeriesPanel 
          series={series}
          config={config}
          onSeriesChange={onSeriesChange}
        />
      </div>
    </div>
  );
};
