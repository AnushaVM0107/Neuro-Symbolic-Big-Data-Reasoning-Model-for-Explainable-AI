
import { ChartData } from 'chart.js';

export interface KPIData {
  title: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface ChartInfo {
  title: string;
  // Chart.js chart types are string literals
  type: 'bar' | 'pie' | 'doughnut';
  data: ChartData;
}

export interface TableData {
    headers: string[];
    rows: string[][];
}

export interface DashboardData {
  kpis: KPIData[];
  charts: ChartInfo[];
  tableData: TableData;
}

export interface AIInsightsData {
  summary: string;
  keyObservations: string[];
  dataQualityIssues: string[];
}