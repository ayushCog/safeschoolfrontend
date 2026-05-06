import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom, map } from 'rxjs';
import {
  selectPendingIncidents,
  selectStaffIncidents,
  selectStaffPortalLoading,
  selectStaffResolutionsByCurrentUser,
} from '../../../../store/staff-portal/staff-portal.selectors';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import {
  loadStaffIncidents,
  addResolution,
  updateIncidentStatus,
  loadResolutions,
} from '../../../../store/staff-portal/staff-portal.actions';
import { Resolution } from '../../../../store/models';

@Component({
  selector: 'app-manage-incidents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-incidents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageIncidentsComponent implements OnInit {
  private store = inject(Store);
  private currentUser$ = this.store.select(selectCurrentUser);

  userIncidents$: Observable<any[]> = this.store.select(selectStaffIncidents);
  pendingIncidents$: Observable<any[]> = this.store.select(selectPendingIncidents);
  myResolutions$: Observable<any[]> = this.store.select(selectStaffResolutionsByCurrentUser);
  loading$: Observable<boolean> = this.store.select(selectStaffPortalLoading);
  selectedFilter: 'user' | 'needsResolution' | 'myResolutions' = 'user';

  showResolveModal = signal(false);
  selectedIncident = signal<any>(null);
  resolutionActions = '';
  resolutionNotes = '';

  ngOnInit(): void {
    this.store.dispatch(loadStaffIncidents());
    this.store.dispatch(loadResolutions());
  }

  refreshIncidents(): void {
    this.store.dispatch(loadStaffIncidents());
    this.store.dispatch(loadResolutions());
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      reported: 'bg-yellow-100 text-yellow-800',
      investigating: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      pending_review: 'bg-blue-100 text-blue-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  formatLocalDate(date: Date | string): string {
    const dt = typeof date === 'string' ? new Date(date) : date;
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
  }

  openResolveModal(incident: any): void {
    this.selectedIncident.set(incident);
    this.resolutionActions = '';
    this.resolutionNotes = '';
    this.showResolveModal.set(true);
  }

  closeResolveModal(): void {
    this.showResolveModal.set(false);
    this.selectedIncident.set(null);
    this.resolutionActions = '';
    this.resolutionNotes = '';
  }

  async submitResolution(): Promise<void> {
    const incident = this.selectedIncident();
    if (!incident || !this.resolutionActions.trim()) {
      alert('Please provide actions taken');
      return;
    }

    const user = await firstValueFrom(this.currentUser$);
    if (!user) {
      alert('Unable to resolve incident without a valid staff user.');
      return;
    }

    const resolution: Resolution = {
      resolutionID: `res-${Date.now()}`,
      incidentID: incident.incidentID,
      officerID: user.userID,
      actions: [this.resolutionActions.trim()],
      date: this.formatLocalDate(new Date()),
      status: 'resolved',
      notes: this.resolutionNotes || undefined,
    };

    this.store.dispatch(addResolution({ resolution, incidentID: incident.incidentID }));
    this.closeResolveModal();
  }
}