import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Card {
  title: string;
  value: string | number;
  icon?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" role="region" [attr.aria-label]="title()">
      <div class="card-content">
        @if (icon()) {
          <div class="icon">{{ icon() }}</div>
        }
        <div class="info">
          <h3>{{ title() }}</h3>
          <p class="value">{{ value() }}</p>
          @if (description()) {
            <p class="description">{{ description() }}</p>
          }
        </div>
      </div>
      @if (trend()) {
        <div class="trend" [class]="'trend-' + trend()">
          @switch (trend()) {
            @case ('up') {
              📈
            }
            @case ('down') {
              📉
            }
            @case ('neutral') {
              ➡️
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .card-content {
      display: flex;
      gap: 1rem;
      flex: 1;
    }

    .icon {
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .info {
      display: flex;
      flex-direction: column;
    }

    h3 {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
    }

    .value {
      margin: 0.5rem 0 0 0;
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
    }

    .description {
      margin: 0.5rem 0 0 0;
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .trend {
      font-size: 1.5rem;
    }

    .trend-up {
      color: #10b981;
    }

    .trend-down {
      color: #ef4444;
    }

    .trend-neutral {
      color: #6b7280;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  title = input<string>('');
  value = input<string | number>(0);
  icon = input<string | null>(null);
  description = input<string | null>(null);
  trend = input<'up' | 'down' | 'neutral' | null>(null);
}
