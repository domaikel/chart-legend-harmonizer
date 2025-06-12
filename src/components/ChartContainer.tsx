
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, SeriesItem, ChartDataPoint } from "@/types/chart";
import { CustomTooltip } from "./CustomTooltip";
import { CustomLegend } from "./CustomLegend";

interface ChartContainerProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  series: SeriesItem[];
}

// Helper function to generate color variations
const generateColorVariations = (baseColor: string, count: number): string[] => {
  const variations = [];
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  for (let i = 0; i < count; i++) {
    const factor = 0.3 + (i * 0.7) / (count - 1); // Range from 30% to 100%
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    variations.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
  }
  
  return variations;
};

export const ChartContainer = ({ data, config, series }: ChartContainerProps) => {
  const visibleSeries = series.filter(s => s.visible);
  
  const getLegendSeries = () => {
    if (config.groupByVersion) {
      return visibleSeries;
    } else {
      // Group by variable - show one legend entry per variable with color variations
      const grouped = new Map<string, SeriesItem[]>();
      visibleSeries.forEach(s => {
        if (!grouped.has(s.variable)) {
          grouped.set(s.variable, []);
        }
        grouped.get(s.variable)!.push(s);
      });
      
      return Array.from(grouped.entries()).map(([variable, variableSeries]) => ({
        ...variableSeries[0],
        versions: variableSeries
      }));
    }
  };

  const getChartSeries = () => {
    if (config.groupByVersion) {
      return visibleSeries;
    } else {
      // Generate color variations for each variable's versions
      const variableGroups = new Map<string, SeriesItem[]>();
      visibleSeries.forEach(s => {
        if (!variableGroups.has(s.variable)) {
          variableGroups.set(s.variable, []);
        }
        variableGroups.get(s.variable)!.push(s);
      });
      
      const result: SeriesItem[] = [];
      variableGroups.forEach((variableSeries, variable) => {
        const baseColor = variableSeries[0].color;
        const colorVariations = generateColorVariations(baseColor, variableSeries.length);
        
        variableSeries.forEach((s, index) => {
          result.push({
            ...s,
            color: colorVariations[index]
          });
        });
      });
      
      return result;
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
              content={<CustomLegend config={config} series={legendSeries} chartSeries={chartSeries} />}
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
