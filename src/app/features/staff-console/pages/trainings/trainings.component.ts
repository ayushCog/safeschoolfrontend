import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import {
  selectStaffTrainings,
  selectStaffPortalLoading,
  selectActivePrograms,
} from '../../../../store/staff-portal/staff-portal.selectors';
import { loadTrainings, loadPrograms, enrollInProgram, markTrainingComplete } from '../../../../store/staff-portal/staff-portal.actions';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingsComponent implements OnInit {
  private store = inject(Store);

  selectedFilter = signal('enrolled');

  trainings$: Observable<any[]> = this.store.select(selectStaffTrainings);
  programs$: Observable<any[]> = this.store.select(selectActivePrograms);
  loading$: Observable<boolean> = this.store.select(selectStaffPortalLoading);
  user$ = this.store.select(selectCurrentUser);

  enrolledProgramIds$: Observable<Set<string>> = combineLatest([this.trainings$, this.user$]).pipe(
    map(([trainings, user]) => {
      if (!user) {
        return new Set<string>();
      }
      return new Set(trainings.filter((t: any) => t.userId === user.userID).map((t: any) => t.programId));
    })
  );

  // Derived state using RxJS map instead of signals
  completedCount$ = this.trainings$.pipe(
    map(items => items.filter(t => t.status === 'completed').length)
  );
  
  pendingCount$ = this.trainings$.pipe(
    map(items => items.filter(t => t.status.toLowerCase() !== 'completed').length)
  );

  ngOnInit(): void {
    this.loadData();
  }

  onFilterChange(): void {
    this.loadData();
  }

  loadData(): void {
    if (this.selectedFilter() === 'enrolled') {
      this.store.dispatch(loadTrainings());
    } else {
      this.store.dispatch(loadPrograms());
    }
  }

  refresh(): void {
    this.loadData();
  }

  enroll(programId: string): void {
    this.store.dispatch(enrollInProgram({ programId }));
  }

  complete(trainingId: string): void {
    this.store.dispatch(markTrainingComplete({ trainingId }));
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}