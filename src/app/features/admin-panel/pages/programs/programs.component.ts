import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllPrograms } from '../../../../store/programs/programs.selectors';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Safety Programs</h2>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Manage school safety programs and trainings</p>
        @if ((programs$ | async); as programs) {
          <div class="mt-4">
            <p>Total Programs: {{ programs.length }}</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsComponent {
  private store = inject(Store);
  programs$ = this.store.select(selectAllPrograms);
}
