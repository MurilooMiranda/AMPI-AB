import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BaseChartDirective } from "ng2-charts";
import { ChartOptions, LabelItem, ChartType } from "chart.js";
import { Chart } from "chart.js/dist";


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
export class DashboardResultsComponent implements OnInit{
  selectedDimension = ""; 
  selectedDemographic = ""; 
  
  dimensionOptions = [
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
  demographicOptions = ["Idade", "Raça", "Cor"];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.markForCheck();
  }
}
