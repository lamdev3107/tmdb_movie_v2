# Input Text Component

Component input text có thể tái sử dụng với nhiều tính năng và tùy chỉnh.

## Cách sử dụng

### Basic Usage

```html
<app-input-text placeholder="Nhập tên của bạn" label="Họ và tên" [(ngModel)]="userName"> </app-input-text>
```

### Với Reactive Forms

```html
<app-input-text placeholder="Nhập email" label="Email" type="email" [formControlName]="emailControl"> </app-input-text>
```

### Với các thuộc tính khác

```html
<app-input-text placeholder="Nhập mật khẩu" label="Mật khẩu" type="password" size="large" required="true" [maxlength]="20" [minlength]="8" [(ngModel)]="password"> </app-input-text>
```

## Input Properties

| Property       | Type             | Default    | Description                                                     |
| -------------- | ---------------- | ---------- | --------------------------------------------------------------- |
| `type`         | `InputTextType`  | `'text'`   | Loại input: 'text', 'email', 'password', 'number', 'tel', 'url' |
| `placeholder`  | `string`         | `''`       | Placeholder text                                                |
| `label`        | `string`         | `''`       | Label hiển thị phía trên input                                  |
| `size`         | `InputTextSize`  | `'medium'` | Kích thước: 'small', 'medium', 'large'                          |
| `disabled`     | `boolean`        | `false`    | Trạng thái disabled                                             |
| `required`     | `boolean`        | `false`    | Bắt buộc nhập                                                   |
| `readonly`     | `boolean`        | `false`    | Chỉ đọc                                                         |
| `maxlength`    | `number \| null` | `null`     | Độ dài tối đa                                                   |
| `minlength`    | `number \| null` | `null`     | Độ dài tối thiểu                                                |
| `pattern`      | `string`         | `''`       | Regex pattern                                                   |
| `autocomplete` | `string`         | `''`       | Autocomplete attribute                                          |
| `name`         | `string`         | `''`       | Name attribute                                                  |
| `id`           | `string`         | `''`       | ID attribute                                                    |

## Output Events

| Event         | Type                       | Description               |
| ------------- | -------------------------- | ------------------------- |
| `valueChange` | `EventEmitter<string>`     | Emit khi giá trị thay đổi |
| `focus`       | `EventEmitter<FocusEvent>` | Emit khi input được focus |
| `blur`        | `EventEmitter<FocusEvent>` | Emit khi input mất focus  |
| `input`       | `EventEmitter<Event>`      | Emit khi có input event   |

## CSS Classes

Component tự động thêm các class CSS dựa trên trạng thái:

- `.input-text--small`, `.input-text--medium`, `.input-text--large`: Kích thước
- `.input-text--disabled`: Trạng thái disabled
- `.input-text--focused`: Trạng thái focus
- `.input-text--has-value`: Khi có giá trị
- `.input-text--error`: Trạng thái lỗi (cần thêm class thủ công)
- `.input-text--success`: Trạng thái thành công (cần thêm class thủ công)

## CSS Variables

Component sử dụng các CSS variables để tùy chỉnh màu sắc:

- `--primary-color`: Màu chính (focus, success)
- `--error-color`: Màu lỗi
- `--success-color`: Màu thành công
- `--text-color`: Màu text
- `--border-color`: Màu viền
- `--background-color`: Màu nền
- `--placeholder-color`: Màu placeholder
- `--disabled-bg-color`: Màu nền khi disabled
- `--disabled-text-color`: Màu text khi disabled

## Ví dụ với Validation

```typescript
// Trong component
export class MyComponent {
  emailControl = new FormControl("", [Validators.required, Validators.email]);

  getEmailError(): string {
    if (this.emailControl.hasError("required")) {
      return "Email là bắt buộc";
    }
    if (this.emailControl.hasError("email")) {
      return "Email không hợp lệ";
    }
    return "";
  }
}
```

```html
<app-input-text placeholder="Nhập email" label="Email" type="email" required="true" [formControlName]="emailControl" [class.input-text--error]="emailControl.invalid && emailControl.touched"> </app-input-text>
<div *ngIf="emailControl.invalid && emailControl.touched" class="error-message">{{ getEmailError() }}</div>
```
