
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
  
  const getSeriesForChart = () => {
    if (config.groupByVersion) {
      return visibleSeries;
    } else {
      // Group by variable - show one line per variable using the first visible version's color
      const grouped = new Map<string, SeriesItem>();
      visibleSeries.forEach(s => {
        if (!grouped.has(s.variable)) {
          grouped.set(s.variable, s);
        }
      });
      return Array.from(grouped.values());
    }
  };

  const chartSeries = getSeriesForChart();

  const getDataKey = (series: SeriesItem) => {
    if (config.groupByVersion) {
      return `${series.variable}-${series.version}`;
    } else {
      // For grouped mode, we'll use the variable name and handle aggregation in data preparation
      return series.variable;
    }
  };

  // Transform data for grouped mode
  const transformedData = config.groupByVersion ? data : data.map(item => {
    const newItem = { ...item };
    
    // For each variable, aggregate values from all visible versions
    const variables = new Set(visibleSeries.map(s => s.variable));
    variables.forEach(variable => {
      const versionsForVariable = visibleSeries.filter(s => s.variable === variable);
      // Use the first available version's value (prioritize Actuals, then Budget, then Forecast)
      const priorityOrder = ['Actuals', 'Budget', 'Forecast'];
      let valueUsed = null;
      
      for (const version of priorityOrder) {
        const key = `${variable}-${version}`;
        if (item[key] !== undefined) {
          valueUsed = item[key];
          break;
        }
      }
      
      // If no priority version found, use the first available
      if (valueUsed === null) {
        for (const versionSeries of versionsForVariable) {
          const key = `${versionSeries.variable}-${versionSeries.version}`;
          if (item[key] !== undefined) {
            valueUsed = item[key];
            break;
          }
        }
      }
      
      if (valueUsed !== null) {
        newItem[variable] = valueUsed;
      }
    });
    
    return newItem;
  });

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              content={<CustomLegend config={config} series={chartSeries} />}
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
