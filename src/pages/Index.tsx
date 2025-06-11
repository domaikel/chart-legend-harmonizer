
import { useState } from "react";
import { ChartDashboard } from "@/components/ChartDashboard";
import { ChartSidebar } from "@/components/ChartSidebar";
import { sampleChartData } from "@/data/sampleData";
import { ChartConfig, SeriesItem } from "@/types/chart";

const Index = () => {
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    groupByVersion: true,
    legendContent: "variable",
    showLegend: true,
  });

  const [seriesData, setSeriesData] = useState<SeriesItem[]>([
    { id: "revenue-actuals", variable: "Revenue", version: "Actuals", color: "#3b82f6", visible: true },
    { id: "revenue-budget", variable: "Revenue", version: "Budget", color: "#10b981", visible: true },
    { id: "revenue-forecast", variable: "Revenue", version: "Forecast", color: "#f59e0b", visible: true },
    { id: "costs-actuals", variable: "Costs", version: "Actuals", color: "#ef4444", visible: true },
    { id: "costs-budget", variable: "Costs", version: "Budget", color: "#8b5cf6", visible: true },
    { id: "costs-forecast", variable: "Costs", version: "Forecast", color: "#f97316", visible: true },
  ]);

  const updateConfig = (newConfig: Partial<ChartConfig>) => {
    setChartConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updateSeries = (newSeries: SeriesItem[]) => {
    setSeriesData(newSeries);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <ChartSidebar 
          config={chartConfig}
          series={seriesData}
          onConfigChange={updateConfig}
          onSeriesChange={updateSeries}
        />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Chart Analytics Dashboard</h1>
              <p className="text-muted-foreground">Interactive charts with advanced legend grouping and series management</p>
            </div>
            <ChartDashboard 
              data={sampleChartData}
              config={chartConfig}
              series={seriesData}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
