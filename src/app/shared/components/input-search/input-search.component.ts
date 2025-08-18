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
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSearchComponent),
      multi: true,
    },
  ],
})
export class InputSearchComponent implements OnInit {
  @Input() options: any[] = [];
  @Input() placeholder: string = 'Enter keyword to search...';
  @Output() onInputChange = new EventEmitter<string>();
  value = false;
  isOpen = false;

  query = '';
  ngOnInit() {}

  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Hàm xử lý click bên ngoài component để đóng dropdown
  handleClickOutside = (event: MouseEvent) => {
    const hostElement = (event.target as HTMLElement).closest(
      'app-input-search'
    );
    if (!hostElement) {
      // this.isOpen = false;
      this.onBlur();
      // KHÔNG removeEventListener ở đây, chỉ đóng dropdown thôi
    }
  };

  ngAfterViewInit() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  onBlur() {
    // if (this.value !== null) {
    //   return;
    // }
    this.isOpen = false;
  }
  // Hàm selectOption được gọi khi người dùng chọn một option trong dropdown.
  // Nó sẽ:
  // 1. Gán giá trị label của option được chọn vào biến query để hiển thị lên input.
  // 2. Gọi hàm onChange để thông báo cho form control biết giá trị đã thay đổi.
  // 3. Gọi hàm onTouched để đánh dấu control đã được "chạm" (touched).
  // 4. Đóng dropdown bằng cách đặt isOpen = false.
  selectOption(option: SelectOption) {
    this.query = option.label;
    // Khi gọi this.onChange(option), giá trị của formControlName sẽ được cập nhật thành option
    this.onChange(option);
    this.onTouched();
    this.isOpen = false;
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

  // Để reset value khi form.reset() ở component cha, ta cần lắng nghe thay đổi của value từ ControlValueAccessor
  // và cập nhật lại query (giá trị hiển thị) về rỗng nếu value bị reset (null hoặc undefined)
  ngOnChanges(changes: any): void {
    // Nếu có thuộc tính value và nó bị reset thì cũng reset query
    if (
      changes.value &&
      (changes.value.currentValue === null ||
        changes.value.currentValue === undefined)
    ) {
      this.query = '';
    }
  }

  // Sửa lại writeValue để đồng bộ query khi value bị reset
  /**
   * Hàm writeValue được gọi bởi Angular khi giá trị của form control thay đổi từ bên ngoài (ví dụ khi gọi form.reset() hoặc setValue()).
   * - Nếu value là null hoặc undefined, tức là giá trị bị reset, thì sẽ đặt query (giá trị hiển thị trên input) về rỗng.
   * - Nếu value có giá trị, sẽ lấy label của option đó để hiển thị lên input.
   * - Gọi this.onChange(value) để thông báo cho form control biết giá trị đã thay đổi.
   * - Gọi this.onTouched() để đánh dấu control đã được "chạm" (touched).
   * - Có log ra console để kiểm tra giá trị value (dòng này có thể dùng để debug).
   */
  writeValue(value: SelectOption): void {
    if (value === null || value === undefined) {
      this.query = '';
    } else {
      this.query = value.label;
    }
    this.onChange(value);
    this.onTouched();
  }

  onQueryChange() {
    this.onInputChange.emit(this.query);
  }
}
