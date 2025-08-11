import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() optionList: SelectOption[] = [];
  @Input() selectedOptionValue?: string;
  @Input() placeholder: string = 'Chọn một tùy chọn';
  @Input() disabled: boolean = false;
  @Input() searchable: boolean = false;

  @Output() onSelectChange = new EventEmitter<string>();

  isOpen: boolean = false;
  searchText: string = '';

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        setTimeout(() => {
          document.addEventListener('click', this.handleClickOutside, true);
        });
      } else {
        document.removeEventListener('click', this.handleClickOutside, true);
      }
    }
  }

  handleClickOutside = (event: MouseEvent) => {
    const hostElement = (event.target as HTMLElement).closest('app-select');
    if (!hostElement) {
      this.closeDropdown();
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  };

  selectOption(option: SelectOption): void {
    this.selectedOptionValue = option.value;
    this.onSelectChange.emit(option.value);
    this.isOpen = false;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  getDisplayValue(): string {
    let currentSelectedOption = this.optionList.find(
      (item) => item.value == this.selectedOptionValue
    );
    return currentSelectedOption?.label as string;
  }

  getFilteredOptions(): SelectOption[] {
    if (!this.searchText) {
      return this.optionList;
    }
    return this.optionList.filter((option) =>
      option.label.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
