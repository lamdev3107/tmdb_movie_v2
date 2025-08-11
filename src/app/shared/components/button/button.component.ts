import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'icon';
export type ButtonSize = 'medium' | 'large' | 'full-width';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() click = new EventEmitter<void>();

  get buttonClasses(): string {
    const classes = ['btn', `btn--${this.variant}`, `btn--${this.size}`];

    if (this.disabled) {
      classes.push('btn--disabled');
    }

    return classes.join(' ');
  }

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
}
