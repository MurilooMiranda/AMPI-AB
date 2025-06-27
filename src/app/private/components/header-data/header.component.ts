import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-header-results',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    RouterOutlet
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderResultsComponent {
  @Output() dateRangeChange = new EventEmitter<{ startDate: Date | null, endDate: Date | null }>();

  constructor(private dateAdapter: DateAdapter<any>) {
    this.dateAdapter.setLocale("pt-BR")
  }

  startDate: Date | null = null;
  endDate: Date | null = null;

  onDateChange() {
    this.dateRangeChange.emit({
      startDate: this.startDate,
      endDate: this.endDate
    });
  }
}
