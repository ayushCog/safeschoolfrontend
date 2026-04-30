import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectDashboardStats,
  selectRecentIncidents,
  selectDashboardNotifications,
  selectDashboardLoading
} from '../../../store/dashboard/dashboard.selectors';
import { loadDashboardStats, loadRecentIncidents, loadNotifications } from '../../../store/dashboard/dashboard.actions';
import { StatCardComponent } from '../stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          (click)="refreshData()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          [disabled]="(loading$ | async)"
        >
          {{ (loading$ | async) ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      @if ((stats$ | async); as stats) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-stat-card
            title="Total Incidents"
            [value]="stats.totalIncidents"
            icon="alert-triangle"
            color="red"
          />
          <app-stat-card
            title="Active Incidents"
            [value]="stats.activeIncidents"
            icon="clock"
            color="yellow"
          />
          <app-stat-card
            title="Resolved Incidents"
            [value]="stats.resolvedIncidents"
            icon="check-circle"
            color="green"
          />
          <app-stat-card
            title="Compliance Rate"
            [value]="stats.complianceRate + '%'"
            icon="shield"
            color="blue"
          />
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Incidents</h2>
          @if ((recentIncidents$ | async); as incidents) {
            <div class="space-y-3">
              @for (incident of incidents; track incident.id) {
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p class="font-medium text-gray-900">{{ incident.title }}</p>
                    <p class="text-sm text-gray-600">{{ incident.reportedAt | date:'short' }}</p>
                  </div>
                  <span
                    class="px-2 py-1 text-xs rounded"
                    [class]="getStatusClass(incident.status)"
                  >
                    {{ incident.status }}
                  </span>
                </div>
              }
            </div>
          }
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
          @if ((notifications$ | async); as notifications) {
            <div class="space-y-3">
              @for (notification of notifications; track notification.id) {
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p class="font-medium text-gray-900">{{ notification.message }}</p>
                    <p class="text-sm text-gray-600">{{ notification.createdAt | date:'short' }}</p>
                  </div>
                  <span
                    class="px-2 py-1 text-xs rounded"
                    [class]="getTypeClass(notification.type)"
                  >
                    {{ notification.type }}
                  </span>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  stats$ = this.store.select(selectDashboardStats);
  recentIncidents$ = this.store.select(selectRecentIncidents);
  notifications$ = this.store.select(selectDashboardNotifications);
  loading$ = this.store.select(selectDashboardLoading);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.store.dispatch(loadDashboardStats());
    this.store.dispatch(loadRecentIncidents());
    this.store.dispatch(loadNotifications());
  }

  refreshData(): void {
    this.loadData();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}