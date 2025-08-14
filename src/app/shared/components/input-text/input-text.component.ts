import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  forwardRef,
  Optional,
  Self,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
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
})
export class InputTextComponent implements ControlValueAccessor, OnInit {
  @Input() type: InputTextType = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() size: InputTextSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() id: string = '';

  value: string = '';
  isFocused: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};
  formControl!: FormControl;

  constructor(@Optional() @Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.ngControl && this.ngControl.control) {
      this.formControl = this.ngControl.control as FormControl;
      this.formControl.updateValueAndValidity();
    }
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  //  ControlValueAccessor methods ---
  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
