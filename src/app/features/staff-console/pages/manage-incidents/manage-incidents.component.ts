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
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <label class="block text-sm font-medium text-gray-700">View</label>
          <select
            [(ngModel)]="selectedFilter"
            class="form-select mt-1 rounded border-gray-300 px-3 py-2"
          >
            <option value="user">All Incidents</option>
            <option value="needsResolution">Incidents Needs Resolution</option>
            <option value="myResolutions">My Resolutions</option>
          </select>
        </div>

        <button
          (click)="refreshIncidents()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          [disabled]="(loading$ | async)"
        >
          {{ (loading$ | async) ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      @if (selectedFilter === 'user') {
        @if (userIncidents$ | async; as incidentList) {
          @if (incidentList.length > 0) {
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-100 border-b">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (incident of incidentList; track incident.incidentID) {
                    <tr class="border-b hover:bg-gray-50">
                      <td class="px-6 py-3 text-sm font-medium">{{ incident.incidentID }}</td>
                      <td class="px-6 py-3 text-sm capitalize">{{ incident.type }}</td>
                      <td class="px-6 py-3 text-sm">{{ incident.location }}</td>
                      <td class="px-6 py-3 text-sm">
                        <span [class]="getStatusClass(incident.status)" class="px-2 py-1 rounded text-xs font-semibold">
                          {{ incident.status }}
                        </span>
                      </td>
                      <td class="px-6 py-3 text-sm">{{ incident.date | date:'shortDate' }}</td>
                      <td class="px-6 py-3 text-sm">
                        @if (incident.status?.toLowerCase?.() !== 'resolved') {
                          <button
                            (click)="openResolveModal(incident)"
                            class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        } @else {
                          <span class="text-gray-500 text-xs">Resolved</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="text-center py-10 text-gray-500">No incidents found.</div>
          }
        }
      }

      @if (selectedFilter === 'needsResolution') {
        @if (pendingIncidents$ | async; as incidentList) {
          @if (incidentList.length > 0) {
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-100 border-b">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (incident of incidentList; track incident.incidentID) {
                    <tr class="border-b hover:bg-gray-50">
                      <td class="px-6 py-3 text-sm font-medium">{{ incident.incidentID }}</td>
                      <td class="px-6 py-3 text-sm capitalize">{{ incident.type }}</td>
                      <td class="px-6 py-3 text-sm">{{ incident.location }}</td>
                      <td class="px-6 py-3 text-sm">
                        <span [class]="getStatusClass(incident.status)" class="px-2 py-1 rounded text-xs font-semibold capitalize">
                          {{ incident.status }}
                        </span>
                      </td>
                      <td class="px-6 py-3 text-sm">{{ incident.date | date:'shortDate' }}</td>
                      <td class="px-6 py-3 text-sm">
                        <button
                          (click)="openResolveModal(incident)"
                          class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="text-center py-10 text-gray-500">No incidents need resolution.</div>
          }
        }
      }

      @if (selectedFilter === 'myResolutions') {
        @if (myResolutions$ | async; as resolutions) {
          @if (resolutions.length > 0) {
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-100 border-b">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Incident ID</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (resolution of resolutions; track resolution.resolutionID) {
                    <tr class="border-b hover:bg-gray-50">
                      <td class="px-6 py-3 text-sm font-medium">{{ resolution.incidentID }}</td>
                      <td class="px-6 py-3 text-sm">
                        {{ formatResolutionActions(resolution.actions) }}
                      </td>
                      <td class="px-6 py-3 text-sm">{{ resolution.date | date:'shortDate' }}</td>
                      <td class="px-6 py-3 text-sm">{{ resolution.status }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="text-center py-10 text-gray-500">No resolutions found for your account.</div>
          }
        }
      }

      <!-- Resolution Modal -->
      @if (showResolveModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Resolve Incident</h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Incident ID</label>
                <input
                  type="text"
                  disabled
                  [value]="selectedIncident()?.incidentID"
                  class="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Actions Taken</label>
                <textarea
                  [(ngModel)]="resolutionActions"
                  placeholder="Describe the actions taken to resolve this incident"
                  rows="3"
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  [(ngModel)]="resolutionNotes"
                  placeholder="Additional notes (optional)"
                  rows="2"
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div class="flex gap-2 justify-end">
                <button
                  (click)="closeResolveModal()"
                  class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  (click)="submitResolution()"
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
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

  // Resolution modal state
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

  formatResolutionActions(actions: string | string[]): string {
    return Array.isArray(actions) ? actions.join(', ') : actions || '-';
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