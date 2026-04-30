import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  selectStaffIncidents,
  selectStaffTrainings,
  selectComplianceRecords,
  selectStaffResolutions,
  selectComplianceScore,
  selectStaffPortalLoading,
} from '../../store/staff-portal/staff-portal.selectors';
import {
  loadStaffIncidents,
  loadTrainings,
  loadComplianceStatus,
  loadResolutions,
} from '../../store/staff-portal/staff-portal.actions';

// Interface Definitions
export type TrainingStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired';

export interface Training {
  trainingID: string;
  programID: string;
  staffID: string;
  completionDate?: string;
  status: TrainingStatus;
  certificationExpiry?: string;
}

@Component({
  selector: 'app-staff-console',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 p-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">School Staff Console</h1>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Trainings Active</h3>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ (inProgressTrainings$ | async) || 0 }}</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Total Resolutions</h3>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ (totalResolutions$ | async) || 0 }}</p>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-4 border-b bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900">Recent Incidents</h2>
          </div>
          @if (incidents$ | async; as incidents) {
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <tbody>
                  @for (incident of incidents; track incident.incidentID) {
                    <tr class="border-b hover:bg-gray-50">
                      <td class="px-4 py-3 font-medium">{{ incident.type }}</td>
                      <td class="px-4 py-3">
                        <span [class]="getStatusClass(incident.status)" class="px-2 py-1 rounded text-xs font-bold uppercase">
                          {{ incident.status }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900">Assigned Trainings</h2>
          </div>
          <div class="p-4 space-y-4">
            @if (trainings$ | async; as trainings) {
              @for (training of trainings; track training.trainingId) {
                <div class="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                  <div>
                    <p class="font-medium text-gray-900">Program: {{ training.programId }}</p>
                    <p class="text-xs text-gray-500 italic">ID: {{ training.trainingId }}</p>
                  </div>
                  <span [class]="getTrainingStatusClass(training.status)" class="px-3 py-1 rounded-full text-xs font-bold">
                    {{ training.status }}
                  </span>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffConsoleComponent implements OnInit {
  private store = inject(Store);

  incidents$ = this.store.select(selectStaffIncidents);
  trainings$ = this.store.select(selectStaffTrainings);
  compliance$ = this.store.select(selectComplianceRecords);
  resolutions$ = this.store.select(selectStaffResolutions);
  complianceScore$ = this.store.select(selectComplianceScore);
  loading$ = this.store.select(selectStaffPortalLoading);

  inProgressTrainings$ = this.trainings$.pipe(
    map(list => list?.filter(t => t.status.toLowerCase() !== 'completed').length || 0)
  );

  totalResolutions$ = this.resolutions$.pipe(
    map(list => list?.length || 0)
  );

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.store.dispatch(loadStaffIncidents());
    this.store.dispatch(loadTrainings());
    this.store.dispatch(loadComplianceStatus());
    this.store.dispatch(loadResolutions());
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      reported: 'bg-red-100 text-red-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getTrainingStatusClass(status: TrainingStatus): string {
    const classes: Record<TrainingStatus, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getComplianceClass(status: string): string {
    const classes: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}