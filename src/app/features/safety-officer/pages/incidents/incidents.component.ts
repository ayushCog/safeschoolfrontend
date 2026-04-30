import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-semibold text-gray-900">Incidents</h2>
      <p class="mt-2 text-gray-600">Review the current incident queue for safety officers.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentsComponent {}