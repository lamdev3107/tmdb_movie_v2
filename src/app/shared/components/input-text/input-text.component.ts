import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';

export type InputTextType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url';
export type InputTextSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() type: InputTextType = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() size: InputTextSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;
  @Input() pattern: string = '';
  @Input() autocomplete: string = '';
  @Input() name: string = '';
  @Input() id: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() input = new EventEmitter<Event>();

  constructor(private el: ElementRef<HTMLElement>) {}

  absControl!: AbstractControl;

  value: string = '';
  isFocused: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  onModelChange() {
    this.onChange(this.value);
  }

  get inputClasses(): string {
    const classes = ['input-text', `input-text--${this.size}`];

    if (this.disabled) {
      classes.push('input-text--disabled');
    }

    if (this.isFocused) {
      classes.push('input-text--focused');
    }

    if (this.value) {
      classes.push('input-text--has-value');
    }

    return classes.join(' ');
  }

  get containerClasses(): string {
    const classes = ['input-text-container'];

    if (this.disabled) {
      classes.push('input-text-container--disabled');
    }

    if (this.isFocused) {
      classes.push('input-text-container--focused');
    }

    return classes.join(' ');
  }

  get errors() {
    return (
      (this.el.nativeElement.closest('.ng-submitted') ||
        this.absControl?.touched ||
        this.absControl?.dirty) &&
      this.absControl?.errors &&
      !this.readonly
    );
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.input.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.isFocused = true;
    this.onTouched();
    this.focus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.blur.emit(event);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.absControl = control;
    if (this.maxLength && control.value?.length > this.maxLength) {
      return {
        maxlength: {
          requiredLength: this.maxLength,
        },
      };
    }
    return null;
  }
}
