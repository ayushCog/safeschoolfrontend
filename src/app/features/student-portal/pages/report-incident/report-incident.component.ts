import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { addStudentIncidentReport } from '../../../../store/student-portal/student-portal.actions';
import { Incident } from '../../../../store/models';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-report-incident',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-incident.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportIncidentComponent {
  private store = inject(Store);
  submitted = signal(false);

  incidentType = signal<'violence' | 'bullying' | 'harassment' | 'theft' | 'vandalism' | 'substance' | 'emergency' | 'other'>('bullying');
  location = signal('Classroom A');
  incidentDate = signal(new Date().toISOString().split('T')[0]);
  description = signal('');

  private formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  async submitReport(): Promise<void> {
    const user = await firstValueFrom(this.store.select(selectCurrentUser));
    if (!user) {
      return;
    }

    const report: Incident = {
      incidentID: `student-${Date.now()}`,
      reporterID: user.userID,
      type: this.incidentType(),
      location: this.location(),
      date: this.formatDate(this.incidentDate()),
      status: 'reported',
      description: this.description(),
    };

    this.store.dispatch(addStudentIncidentReport({ report }));
    this.submitted.set(true);
    this.description.set('');
  }
}