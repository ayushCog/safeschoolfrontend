import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Reports & Analytics</h2>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Generate safety reports and view analytics</p>
        <div class="mt-4">
          <p>Reports and analytics functionality coming soon...</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {}
