import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClass()"
      [disabled]="isDisabled()"
      [type]="buttonType()"
      [attr.aria-label]="label()"
    >
      {{ label() }}
    </button>
  `,
  styles: [`
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    button.primary {
      background-color: #3b82f6;
      color: white;
    }

    button.primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    button.secondary {
      background-color: #e5e7eb;
      color: #1f2937;
    }

    button.secondary:hover:not(:disabled) {
      background-color: #d1d5db;
    }

    button.danger {
      background-color: #ef4444;
      color: white;
    }

    button.danger:hover:not(:disabled) {
      background-color: #dc2626;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  label = input<string>('Button');
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  isDisabled = input<boolean>(false);
  buttonType = input<'button' | 'submit' | 'reset'>('button');

  buttonClass = () => `btn btn-${this.variant()}`;
}
