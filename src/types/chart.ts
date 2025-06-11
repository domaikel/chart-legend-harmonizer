
export interface ChartConfig {
  groupByVersion: boolean;
  legendContent: "variable" | "version";
  showLegend: boolean;
}

export interface SeriesItem {
  id: string;
  variable: string;
  version: string;
  color: string;
  visible: boolean;
}

export interface ChartDataPoint {
  period: string;
  [key: string]: string | number;
}
