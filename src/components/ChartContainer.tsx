
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, SeriesItem, ChartDataPoint } from "@/types/chart";
import { CustomTooltip } from "./CustomTooltip";
import { CustomLegend } from "./CustomLegend";

interface ChartContainerProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  series: SeriesItem[];
}

export const ChartContainer = ({ data, config, series }: ChartContainerProps) => {
  const visibleSeries = series.filter(s => s.visible);
  
  const getLegendSeries = () => {
    if (config.groupByVersion) {
      return visibleSeries;
    } else {
      // Group by variable - show one legend entry per variable
      const grouped = new Map<string, SeriesItem>();
      visibleSeries.forEach(s => {
        if (!grouped.has(s.variable)) {
          grouped.set(s.variable, s);
        }
      });
      return Array.from(grouped.values());
    }
  };

  const getChartSeries = () => {
    if (config.groupByVersion) {
      return visibleSeries;
    } else {
      // In grouped mode, we still show all series as lines but with unified colors
      const variableColors = new Map<string, string>();
      visibleSeries.forEach(s => {
        if (!variableColors.has(s.variable)) {
          variableColors.set(s.variable, s.color);
        }
      });
      
      return visibleSeries.map(s => ({
        ...s,
        color: variableColors.get(s.variable) || s.color
      }));
    }
  };

  const legendSeries = getLegendSeries();
  const chartSeries = getChartSeries();

  const getDataKey = (series: SeriesItem) => {
    return `${series.variable}-${series.version}`;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="period" 
            className="text-sm text-muted-foreground"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-sm text-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            content={<CustomTooltip config={config} series={series} />}
            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          />
          {config.showLegend && (
            <Legend 
              content={<CustomLegend config={config} series={legendSeries} />}
            />
          )}
          {chartSeries.map((s, index) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={getDataKey(s)}
              stroke={s.color}
              strokeWidth={2}
              dot={{ fill: s.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: s.color, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
