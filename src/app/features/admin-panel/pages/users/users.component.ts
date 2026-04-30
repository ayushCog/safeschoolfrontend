import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '../../../../store/users/users.selectors';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Manage system users and roles</p>
        @if ((users$ | async); as users) {
          <div class="mt-4">
            <p>Total Users: {{ users.length }}</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  private store = inject(Store);
  users$ = this.store.select(selectAllUsers);
}
