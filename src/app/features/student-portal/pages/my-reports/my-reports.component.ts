import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadStudentIncidentReports } from '../../../../store/student-portal/student-portal.actions';
import { selectStudentIncidentReportsForCurrentUser, selectStudentPortalLoading } from '../../../../store/student-portal/student-portal.selectors';

@Component({
  selector: 'app-my-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-900">My Reports</h2>
        @if (loading$ | async) {
          <span class="text-sm text-gray-500 animate-pulse">Loading...</span>
        }
      </div>

      @if (reports$ | async; as reports) {
        @if (reports.length > 0) {
          <div class="space-y-4">
            @for (report of reports; track $index) {
              <div class="border rounded-lg p-4 bg-gray-50">
                <div class="flex justify-between items-center mb-2">
                  <p class="font-semibold text-gray-900 capitalize">{{ report.type }}</p>
                  <span class="text-xs uppercase tracking-wide text-white bg-indigo-600 px-2 py-1 rounded">
                    {{ report.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">Location: {{ report.location }}</p>
                <p class="text-sm text-gray-600">Submitted: {{ report.date | date:'short' }}</p>
                <p class="mt-2 text-gray-700">{{ report.description }}</p>
              </div>
            }
          </div>
        } @else {
          <div class="text-center text-gray-500 py-10">No reports have been submitted yet.</div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyReportsComponent implements OnInit {
  private store = inject(Store);

  // Use 'any[]' or your Incident model instead of 'unknown[]' to avoid template errors
  reports$ = this.store.select(selectStudentIncidentReportsForCurrentUser);
  loading$ = this.store.select(selectStudentPortalLoading);

  ngOnInit(): void {
    this.store.dispatch(loadStudentIncidentReports());
  }
}