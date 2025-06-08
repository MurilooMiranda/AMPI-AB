import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  series?: ApexNonAxisChartSeries | ApexAxisChartSeries;
  labels?: string[];
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  markers?: ApexMarkers;
  colors?: string[];
  tooltip?: ApexTooltip;
  yaxis?: ApexYAxis;
  grid?: ApexGrid;
  fill?: ApexFill;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
};
