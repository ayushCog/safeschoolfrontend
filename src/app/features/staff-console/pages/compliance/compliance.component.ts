import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  selectComplianceRecords,
  selectComplianceScore,
  selectStaffPortalLoading,
} from '../../../../store/staff-portal/staff-portal.selectors';
import { loadComplianceStatus } from '../../../../store/staff-portal/staff-portal.actions';

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-gray-900">Compliance Monitoring</h2>
        <button
          (click)="refreshCompliance()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          [disabled]="(loading$ | async)"
        >
          {{ (loading$ | async) ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="font-semibold text-gray-900">Compliance Score</h3>
          @if (complianceScore$ | async; as score) {
            <p [class]="getScoreClass(score)" class="text-3xl font-bold mt-2">
              {{ score }}%
            </p>
          } @else {
            <p class="text-3xl font-bold text-gray-400 mt-2">0%</p>
          }
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="font-semibold text-gray-900">Status</h3>
          <p class="text-lg font-semibold text-blue-600 mt-2">
            {{ getComplianceStatus(complianceScore$ | async) }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="font-semibold text-gray-900">Records</h3>
          <p class="text-3xl font-bold text-gray-700 mt-2">
            {{ recordCount$ | async }}
          </p>
        </div>
      </div>

      @if (complianceRecords$ | async; as records) {
        @if (records.length > 0) {
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-100 border-b">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Record ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Type</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Result</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                @for (record of records; track record.complianceID) {
                  <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-3 text-sm font-medium">{{ record.complianceID }}</td>
                    <td class="px-6 py-3 text-sm">{{ record.type }}</td>
                    <td class="px-6 py-3 text-sm">
                      <span [class]="getStatusClass(record.status)" class="px-2 py-1 rounded text-xs font-semibold">
                        {{ record.status }}
                      </span>
                    </td>
                    <td class="px-6 py-3 text-sm">
                      <span [class]="getResultClass(record.result)" class="px-2 py-1 rounded text-xs font-semibold">
                        {{ record.result }}
                      </span>
                    </td>
                    <td class="px-6 py-3 text-sm">{{ record.recordDate | date:'short' }}</td>
                    <td class="px-6 py-3 text-sm">{{ record.notes || '-' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="text-center py-10 text-gray-500">No compliance records found.</div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceComponent implements OnInit {
  private store = inject(Store);

  complianceRecords$: Observable<any[]> = this.store.select(selectComplianceRecords);
  complianceScore$: Observable<number> = this.store.select(selectComplianceScore);
  loading$: Observable<boolean> = this.store.select(selectStaffPortalLoading);

  // Derived using pipe(map(...)) exactly like the training component
  recordCount$ = this.complianceRecords$.pipe(
    map(records => records?.length || 0)
  );

  ngOnInit(): void {
    this.store.dispatch(loadComplianceStatus());
  }

  refreshCompliance(): void {
    this.store.dispatch(loadComplianceStatus());
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
      reviewed: 'bg-blue-100 text-blue-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getResultClass(result: string): string {
    const classes: Record<string, string> = {
      compliant: 'bg-green-100 text-green-800',
      non_compliant: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-orange-100 text-orange-800',
    };
    return classes[result] || 'bg-gray-100 text-gray-800';
  }

  getScoreClass(score: number | null): string {
    if (score === null) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getComplianceStatus(score: number | null): string {
    if (score === null) return 'Unknown';
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  }
}