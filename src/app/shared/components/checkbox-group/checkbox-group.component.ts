import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface CheckboxOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CheckboxGroupComponent {
  @Input() options: CheckboxOption[] = [];
  @Input() selectedValues: any[] = [];
  @Input() disabled: boolean = false;
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() maxSelections?: number;

  @Output() onSelectionChange = new EventEmitter<any[]>();

  isOptionSelected(value: any): boolean {
    return this.selectedValues.includes(value);
  }

  toggleOption(option: CheckboxOption): void {
    if (this.disabled || option.disabled) {
      return;
    }

    const isSelected = this.isOptionSelected(option.value);

    if (isSelected) {
      // Bỏ chọn
      this.selectedValues = this.selectedValues.filter(
        (val) => val !== option.value
      );
    } else {
      // Chọn mới
      if (
        this.maxSelections &&
        this.selectedValues.length >= this.maxSelections
      ) {
        return; // Không cho phép chọn thêm nếu đã đạt giới hạn
      }
      this.selectedValues = [...this.selectedValues, option.value];
    }

    this.onSelectionChange.emit([...this.selectedValues]);
  }

  getContainerClass(): string {
    return `checkbox-group-container ${this.layout}`;
  }

  getOptionClass(option: CheckboxOption): string {
    const baseClass = 'checkbox-option';
    const isSelected = this.isOptionSelected(option.value);
    const isDisabled = this.disabled || option.disabled;

    return `${baseClass} ${isSelected ? 'selected' : ''} ${
      isDisabled ? 'disabled' : ''
    }`;
  }

  canSelectMore(): boolean {
    return (
      !this.maxSelections || this.selectedValues.length < this.maxSelections
    );
  }
}
