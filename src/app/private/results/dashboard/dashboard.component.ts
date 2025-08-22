import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartType, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    BaseChartDirective,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardResultsComponent implements OnInit {

  dimensionChartType: ChartType = 'pie';
  dimensionChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['NÃO para todos os itens (37%)', 'SIM de 1 a 4 itens (63%)'],
    datasets: [{
      data: [37, 63],
      backgroundColor: ['#fd7e14', '#e83e8c'],
    }]
  };
  dimensionChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false, // Important for controlling size with CSS
    plugins: {
      legend: {
        display: false
      }
    }
    // Removed: cutout: '60%', // Reverted to full pie chart
  };

  fragilityChartType: ChartType = 'bar';
  fragilityChartData: ChartData<'bar'> = {
    labels: ['jan', 'fev', 'mar', 'abr', 'mai'],
    datasets: [
      {
        label: 'Saudável',
        data: [40, 25, 35, 45, 20],
        backgroundColor: '#007bff',
        stack: 'Stack 0',
      },
      {
        label: 'Frágil',
        data: [15, 30, 10, 5, 25],
        backgroundColor: '#ffc107',
        stack: 'Stack 0',
      },
      {
        label: 'Não-Frágil',
        data: [5, 10, 20, 15, 40],
        backgroundColor: '#28a745',
        stack: 'Stack 0',
      }
    ],
  };
  fragilityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Important for controlling size with CSS
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Número de entrevistas'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  demographicChartType: ChartType = 'pie';
  demographicChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Negro (30%)', 'Branco (58%)', 'Pardo (12%)'],
    datasets: [{
      data: [30, 58, 12],
      backgroundColor: ['#dc3545', '#00e0ff', '#6f42c1'],
    }]
  };
  demographicChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false, // Important for controlling size with CSS
    plugins: {
      legend: {
        display: false
      }
    }
    // Removed: cutout: '60%', // Reverted to full pie chart
  };

  professionalsChartType: ChartType = 'bar';
  professionalsChartData: ChartData<'bar'> = {
    labels: ['jan', 'fev', 'mar', 'abr', 'mai'],
    datasets: [
      {
        label: 'Enfermeiro',
        data: [80, 70, 60, 75, 50],
        backgroundColor: '#6610f2',
      },
      {
        label: 'Médico',
        data: [60, 50, 40, 60, 30],
        backgroundColor: '#ffc107',
      },
      {
        label: 'Assistente social',
        data: [40, 30, 20, 35, 20],
        backgroundColor: '#007bff',
      },
    ],
  };
  professionalsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Important for controlling size with CSS
    scales: {
      y: {
        title: {
          display: true,
          text: 'Número de avaliações (em milhar)'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  outcomesChartType: ChartType = 'bar';
  outcomesChartData: ChartData<'bar'> = {
    labels: ['jan', 'fev', 'mar', 'abr', 'mai'],
    datasets: [
      {
        label: 'Humor',
        data: [80, 70, 60, 75, 50],
        backgroundColor: '#e83e8c',
      },
      {
        label: 'Cognição',
        data: [60, 50, 40, 60, 30],
        backgroundColor: '#28a745',
      },
      {
        label: 'Limitação Física',
        data: [40, 30, 20, 35, 20],
        backgroundColor: '#fd7e14',
      },
      {
        label: 'Visão',
        data: [70, 60, 50, 65, 40],
        backgroundColor: '#00e0ff',
      },
      {
        label: 'Audição',
        data: [50, 40, 30, 45, 25],
        backgroundColor: '#6f42c1',
      },
    ],
  };
  outcomesChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Important for controlling size with CSS
    scales: {
      y: {
        min: 0,
        max: 90,
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  selectedDimension: string | null;
  dimensionOptions: string[] = [
    "Idade",
    "Autopercepção de Saúde",
    "Suporte Social",
    "Condição Crônica",
    "Medicamentos",
    "Internações",
    "Quedas",
    "Visão",
    "Audição",
    "Limitação Física",
    "Cognição",
    "Humor",
    "ABVD",
    "AIVD",
    "Incontinência",
    "Perda de Peso",
    "Condição Bucal"

  ];

  selectedDemographic: string | null;
  demographicOptions: string[] = ["Idade", "Raça", "Cor"];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.markForCheck();
  }
}