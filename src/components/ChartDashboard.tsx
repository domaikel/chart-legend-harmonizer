
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ChartContainer";
import { ChartConfig, SeriesItem, ChartDataPoint } from "@/types/chart";

interface ChartDashboardProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  series: SeriesItem[];
}

export const ChartDashboard = ({ data, config, series }: ChartDashboardProps) => {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-xl">
            Revenue & Costs Analysis
            <div className="flex items-center gap-2 ml-auto">
              <div className="text-sm text-muted-foreground">
                {config.groupByVersion ? "Grouped by Version" : "Grouped by Variable"}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer 
            data={data}
            config={config}
            series={series}
          />
        </CardContent>
      </Card>
    </div>
  );
};
