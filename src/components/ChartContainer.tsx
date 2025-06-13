
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartConfig, SeriesItem, ChartDataPoint } from "@/types/chart";
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

  // Convert data to Highcharts format
  const categories = data.map(d => d.period);
  
  const highchartsSeries: Highcharts.SeriesOptionsType[] = chartSeries.map(s => {
    const dataKey = getDataKey(s);
    const seriesData = data.map(d => d[dataKey] as number || null);
    
    return {
      type: 'line',
      name: `${s.variable} (${s.version})`,
      data: seriesData,
      color: s.color,
      marker: {
        enabled: true,
        radius: 4,
        states: {
          hover: {
            radius: 6
          }
        }
      },
      // Hide from legend if we're in grouped mode - we'll use custom legend
      showInLegend: config.groupByVersion
    };
  });

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      height: config.showLegend ? 450 : 384, // Increase height when legend is shown
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories,
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      lineColor: 'hsl(var(--border))',
      tickColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--muted-foreground))',
          fontSize: '12px'
        }
      }
    },
    yAxis: {
      title: {
        text: undefined
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      lineColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--muted-foreground))',
          fontSize: '12px'
        },
        formatter: function() {
          return `$${(this.value as number / 1000).toFixed(0)}k`;
        }
      }
    },
    tooltip: {
      shared: false, // Only show data for hovered series
      backgroundColor: 'hsl(var(--background))',
      borderColor: 'hsl(var(--border))',
      borderRadius: 8,
      shadow: true,
      style: {
        color: 'hsl(var(--foreground))',
        fontSize: '12px'
      },
      formatter: function() {
        const point = this;
        const seriesName = this.series.name;
        const value = point.y;
        
        return `
          <div style="padding: 8px;">
            <div style="font-weight: 600; margin-bottom: 8px; color: hsl(var(--foreground));">${point.x}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${this.series.color};"></div>
              <span style="color: hsl(var(--muted-foreground));">${seriesName}:</span>
              <span style="font-weight: 500;">$${value?.toLocaleString()}</span>
            </div>
          </div>
        `;
      },
      useHTML: true
    },
    legend: {
      enabled: config.showLegend && config.groupByVersion,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      margin: 20,
      itemStyle: {
        color: 'hsl(var(--foreground))',
        fontSize: '12px',
        fontWeight: 'normal'
      },
      itemHoverStyle: {
        color: 'hsl(var(--foreground))'
      },
      symbolWidth: 12,
      symbolHeight: 12,
      symbolRadius: 6,
      useHTML: true
    },
    plotOptions: {
      line: {
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 2
          }
        },
        marker: {
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    },
    series: highchartsSeries,
    credits: {
      enabled: false
    }
  };

  return (
    <div className="w-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
      {config.showLegend && !config.groupByVersion && (
        <CustomLegend config={config} series={legendSeries} chartSeries={chartSeries} />
      )}
    </div>
  );
};
