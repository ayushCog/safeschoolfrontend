import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Staff Management</h2>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Manage staff roles and permissions</p>
        <div class="mt-4">
          <p>Staff management functionality coming soon...</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffManagementComponent {}
