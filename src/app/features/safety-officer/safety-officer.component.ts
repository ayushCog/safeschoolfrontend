import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-safety-officer',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Safety Officer Portal</h1>
      <p class="text-gray-600 mb-6">Monitor incidents, resolve reports, and manage drills from this dashboard.</p>
      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SafetyOfficerComponent {}
