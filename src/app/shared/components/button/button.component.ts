import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  label = input<string>('Button');
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  isDisabled = input<boolean>(false);
  buttonType = input<'button' | 'submit' | 'reset'>('button');
  customClass = input<string>('');

  buttonClass = () => `btn btn-${this.variant()} ${this.customClass()}`.trim();
}