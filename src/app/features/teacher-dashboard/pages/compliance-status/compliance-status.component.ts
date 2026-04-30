import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compliance-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-semibold text-gray-900">Compliance Status</h2>
      <p class="mt-2 text-gray-600">View compliance status for your classroom and school programs.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceStatusComponent {}