import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

interface Patient {
  name: string;
  score: string;
  age: string;
  date: string;
}

@Component({
  selector: "app-patients",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.scss"],
})
export class PatientsComponent {
  patients: Patient[] = [
    {
      name: "Isabel M.",
      score: "11 pontos",
      age: "78 anos",
      date: "22/11/2024",
    },
    {
      name: "Marcos A.",
      score: "11 pontos",
      age: "85 anos",
      date: "13/10/2024",
    },
    {
      name: "Scheila L.",
      score: "10 pontos",
      age: "90 anos",
      date: "17/07/2024",
    },
    {
      name: "Natali V.",
      score: "9 pontos",
      age: "65 anos",
      date: "10/02/2025",
    },
    { name: "Maria A.", score: "9 pontos", age: "73 anos", date: "05/01/2025" },
    { name: "Breno D.", score: "8 pontos", age: "59 anos", date: "13/05/2024" },
    { name: "Paula C.", score: "7 pontos", age: "68 anos", date: "18/08/2024" },
    {
      name: "Gustavo N.",
      score: "7 pontos",
      age: "72 anos",
      date: "05/12/2024",
    },
    { name: "Lucas F.", score: "6 pontos", age: "83 anos", date: "28/12/2024" },
    {
      name: "Leonardo M.",
      score: "6 pontos",
      age: "80 anos",
      date: "17/01/2025",
    },
    {
      name: "Gisele V.",
      score: "5 pontos",
      age: "66 anos",
      date: "14/08/2024",
    },
    {
      name: "Otavio N.",
      score: "5 pontos",
      age: "74 anos",
      date: "20/09/2024",
    },
  ];

  startDate: string = "18/01/2025";
  endDate: string = "28/05/2025";
}
