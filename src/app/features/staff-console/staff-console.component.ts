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
  templateUrl: './staff-console.component.html',
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