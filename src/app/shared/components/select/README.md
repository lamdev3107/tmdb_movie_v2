# Select Component

Component select tùy chỉnh với thiết kế hiện đại và responsive.

## Cách sử dụng

```html
<app-select [optionList]="options" [selectedOption]="selectedOption" [placeholder]="'Chọn một tùy chọn'" [disabled]="false" (onSelectChange)="handleSelectionChange($event)"> </app-select>
```

## Input Properties

- `optionList: SelectOption[]` - Danh sách các tùy chọn
- `selectedOption: SelectOption | null` - Tùy chọn được chọn hiện tại
- `placeholder: string` - Text hiển thị khi chưa chọn tùy chọn nào (mặc định: 'Chọn một tùy chọn')
- `disabled: boolean` - Vô hiệu hóa component (mặc định: false)

## Output Events

- `onSelectChange: EventEmitter<SelectOption>` - Emit khi người dùng chọn một tùy chọn

## Interface SelectOption

```typescript
interface SelectOption {
  value: any;
  label: string;
}
```

## Ví dụ sử dụng

```typescript
// Trong component
export class MyComponent {
  options: SelectOption[] = [
    { value: 1, label: "Tùy chọn 1" },
    { value: 2, label: "Tùy chọn 2" },
    { value: 3, label: "Tùy chọn 3" },
  ];

  selectedOption: SelectOption | null = null;

  handleSelectionChange(option: SelectOption) {
    console.log("Đã chọn:", option);
    this.selectedOption = option;
  }
}
```

## Tính năng

- ✅ Dropdown tùy chỉnh với animation mượt mà
- ✅ Hỗ trợ responsive
- ✅ Keyboard navigation
- ✅ Accessibility support
- ✅ Custom styling với SCSS
- ✅ Disabled state
- ✅ Placeholder text
- ✅ Selected state highlighting
- ✅ Scrollable dropdown cho danh sách dài
- ✅ Auto-close khi click outside
- ✅ Focus management

## Styling

Component sử dụng SCSS với các biến CSS có thể tùy chỉnh:

- Border radius: 8px
- Primary color: #007bff
- Border color: #e1e5e9
- Text color: #495057
- Disabled color: #6c757d
