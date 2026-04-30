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
  template: `
    <div class="p-6 bg-white rounded-lg shadow space-y-4">
      <div>
        <h2 class="text-2xl font-semibold text-gray-900">Report Incident</h2>
        <p class="mt-2 text-gray-600">Submit a new incident report to the school safety team.</p>
      </div>

      <form (ngSubmit)="submitReport()" class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium text-gray-700">Incident Type</span>
            <select
              [(ngModel)]="incidentType" 
              name="type"
              required
              class="form-input mt-1 w-full"
            >
              <option value="violence">Violence</option>
              <option value="bullying">Bullying</option>
              <option value="harassment">Harassment</option>
              <option value="theft">Theft</option>
              <option value="vandalism">Vandalism</option>
              <option value="substance">Substance</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label class="block">
            <span class="text-sm font-medium text-gray-700">Location</span>
            <input
              type="text"
              [(ngModel)]="location"
              name="location"
              required
              placeholder="e.g. Library"
              class="form-input mt-1 w-full"
            />
          </label>

          <label class="block">
            <span class="text-sm font-medium text-gray-700">Incident Date</span>
            <input
              type="date"
              [(ngModel)]="incidentDate"
              name="date"
              required
              class="form-input mt-1 w-full"
            />
          </label>
        </div>

        <label class="block">
          <span class="text-sm font-medium text-gray-700">Description</span>
          <textarea
            [(ngModel)]="description"
            name="description"
            rows="4"
            class="form-input mt-1 w-full"
            placeholder="Provide details about the incident"
            required
          ></textarea>
        </label>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            class="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit Report
          </button>
          
          @if (submitted()) {
            <span class="text-sm text-green-700">Report submitted successfully.</span>
          }
        </div>
      </form>
    </div>
  `,
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