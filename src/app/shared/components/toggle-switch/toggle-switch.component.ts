import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

interface ToggleOption {
  value: string;
  label: string;
}
@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent implements OnInit {
  @Input() options: ToggleOption[] = [];
  @Input() defaultValue: string | null = null;

  selectedOption: ToggleOption | null = null;

  @Output() optionChanged = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['defaultValue'] &&
      changes['defaultValue'].currentValue &&
      changes['options'] &&
      changes['options'].currentValue
    ) {
      this.selectedOption =
        this.options.find(
          (item) => item.value === changes['defaultValue'].currentValue
        ) || null;
    }
  }

  selectOption(option: ToggleOption): void {
    if (this.selectedOption?.value !== option.value) {
      this.selectedOption = option;
      this.optionChanged.emit(option.value);
    }
  }
}
