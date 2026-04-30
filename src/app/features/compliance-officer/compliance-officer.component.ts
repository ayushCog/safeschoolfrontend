import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-compliance-officer',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Compliance Officer Portal</h1>
      <p class="text-gray-600 mb-6">Review policies, audits, and compliance activity from here.</p>
      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceOfficerComponent {}
