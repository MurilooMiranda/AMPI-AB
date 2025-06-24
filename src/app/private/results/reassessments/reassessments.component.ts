import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

interface Reassessments {
  name: string;
  score: string;
  date: string;
  reassessmentPeriod: string;
}

@Component({
  selector: "app-reassessments",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./reassessments.component.html",
  styleUrls: ["./reassessments.component.scss"],
})
export class ReassessmentsComponent {
  patients: Reassessments[] = [
    {
      name: "Maria Clara da Costa",
      score: "11",
      date: "25/11/2024",
      reassessmentPeriod: "5 dias",
    },
    {
      name: "Marcelo de Andrade",
      score: "9",
      date: "13/10/2024",
      reassessmentPeriod: "3 semanas",
    },
    {
      name: "Severino Lacerda",
      score: "7",
      date: "18/08/2024",
      reassessmentPeriod: "4 meses",
    },
    {
      name: "Tomas Cavalcanti",
      score: "5",
      date: "08/01/2025",
      reassessmentPeriod: "6 meses",
    },
    {
      name: "Scheila Vieira Silva",
      score: "3",
      date: "13/01/2025",
      reassessmentPeriod: "2 meses",
    },
  ];

  startDate: string = "Data Inicial";
  endDate: string = "Data Final";
}
