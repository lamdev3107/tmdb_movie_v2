import {
  Component,
  OnInit,
  forwardRef,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
export interface SelectOption {
  value: any;
  label: string;
}
@Component({
  selector: 'app-input-chip-list',
  templateUrl: './input-chip-list.component.html',
  styleUrls: ['./input-chip-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputChipListComponent),
      multi: true,
    },
  ],
})
export class InputChipListComponent implements OnInit {
  @Input() options: any[] = [];
  @Output() onInputChange = new EventEmitter<string>();
  selectedOptions: any[] = [];
  value = false;
  isOpen = false;

  query = '';
  ngOnInit() {}

  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Hàm xử lý click bên ngoài component để đóng dropdown
  handleClickOutside = (event: MouseEvent) => {
    const hostElement = (event.target as HTMLElement).closest(
      'app-input-chip-list'
    );
    if (!hostElement) {
      this.isOpen = false;
      // KHÔNG removeEventListener ở đây, chỉ đóng dropdown thôi
    }
  };

  ngAfterViewInit() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }
  /**
   * Hàm này được gọi bởi Angular khi giá trị từ FormControl thay đổi (tức là khi form set value cho control này).
   * Nó nhận vào giá trị mới và cập nhật lại selectedOptions để hiển thị các chip đã chọn.
   * Nếu value là mảng các giá trị (id), ta sẽ map sang các option tương ứng trong options.
   */
  writeValue(value: SelectOption[]): void {
    if (Array.isArray(value)) {
      // Lọc ra các option có trong danh sách value truyền vào
      this.selectedOptions = value;
    } else if (value == null) {
      this.selectedOptions = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onFocus() {
    this.isOpen = true;
  }

  onQueryChange() {
    this.onInputChange.emit(this.query);
  }

  selectOption(option: any) {
    if (!this.selectedOptions.some((k) => k.value === option.value)) {
      this.selectedOptions.push(option);
    }
    this.isOpen = false;
    this.onChange(option);
    this.query = '';
    this.onTouched(); // đánh dấu touched
  }

  returnValue() {
    return this.selectedOptions.reduce((acc, curr) => {
      acc.push(curr.value);
      return acc;
    }, []);
  }

  removeOption(value: any) {
    this.selectedOptions = this.selectedOptions.filter(
      (k) => k.value !== value
    );
    this.onChange(this.returnValue());
    this.onTouched(); // đánh dấu touched
  }
}
