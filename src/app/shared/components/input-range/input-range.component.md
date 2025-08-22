# Input Range Component

Component input range với giao diện đẹp, hỗ trợ reactive form và có thể tùy chỉnh.

## Tính năng

- Hỗ trợ reactive form (ControlValueAccessor)
- Range slider với 2 handles (min/max)
- Tick marks và labels tùy chỉnh
- Tùy chỉnh số lượng tick marks
- Giao diện responsive
- Hỗ trợ disabled state
- Animation và hover effects

## Cách sử dụng

### Basic Usage

```html
<app-input-range title="User Score" [min]="0" [max]="10" [step]="1" (valueChange)="onRangeChange($event)"> </app-input-range>
```

### Với Custom Tick Count

```html
<!-- Hiển thị 5 tick marks -->
<app-input-range title="Rating Range" [min]="1" [max]="5" [step]="0.5" [tickCount]="5" (valueChange)="onRangeChange($event)"> </app-input-range>

<!-- Hiển thị 10 tick marks -->
<app-input-range title="Percentage" [min]="0" [max]="100" [step]="5" [tickCount]="10" (valueChange)="onRangeChange($event)"> </app-input-range>
```

### Với Reactive Form

```typescript
// Trong component
import { FormBuilder, FormGroup } from "@angular/forms";
import { RangeValue } from "@shared/components/input-range/input-range.component";

export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      scoreRange: [{ min: 0, max: 10 }],
    });
  }

  onRangeChange(value: RangeValue) {
    console.log("Range changed:", value);
  }
}
```

```html
<!-- Trong template -->
<form [formGroup]="form">
  <app-input-range title="User Score" [min]="0" [max]="10" [step]="1" [tickCount]="3" formControlName="scoreRange" (valueChange)="onRangeChange($event)"> </app-input-range>
</form>
```

## Input Properties

| Property     | Type    | Default | Description                       |
| ------------ | ------- | ------- | --------------------------------- |
| `title`      | string  | ''      | Tiêu đề hiển thị phía trên slider |
| `min`        | number  | 0       | Giá trị tối thiểu                 |
| `max`        | number  | 10      | Giá trị tối đa                    |
| `step`       | number  | 1       | Bước nhảy giữa các giá trị        |
| `disabled`   | boolean | false   | Trạng thái disabled               |
| `showTicks`  | boolean | true    | Hiển thị tick marks               |
| `showLabels` | boolean | true    | Hiển thị labels                   |
| `tickCount`  | number  | 0       | Số lượng tick marks (0 = tự động) |

## Tick Count Behavior

- **`tickCount = 0`** (default): Hiển thị tất cả tick marks dựa trên `step`
- **`tickCount > 0`**: Hiển thị chính xác số lượng tick marks được chỉ định
  - Tick marks sẽ được phân bố đều trên range
  - Major ticks (labels) sẽ là: first, middle, last
  - Ví dụ: `tickCount = 5` sẽ hiển thị 6 tick marks (0, 1, 2, 3, 4, 5)

## Output Events

| Event         | Type                     | Description               |
| ------------- | ------------------------ | ------------------------- |
| `valueChange` | EventEmitter<RangeValue> | Emit khi giá trị thay đổi |

## Interface

```typescript
export interface RangeValue {
  min: number;
  max: number;
}
```

## Styling

Component sử dụng CSS custom properties và có thể tùy chỉnh thông qua CSS variables:

- `--input-range-track-color`: Màu track
- `--input-range-thumb-color`: Màu thumb
- `--input-range-tick-color`: Màu tick marks
- `--input-range-label-color`: Màu labels

## Browser Support

- Chrome/Edge (Webkit)
- Firefox (Mozilla)
- Safari (Webkit)
- IE11+ (MS)

## Ví dụ thực tế

```html
<!-- Slider đánh giá 1-5 sao với 5 tick marks -->
<app-input-range title="Đánh giá sao" [min]="1" [max]="5" [step]="0.5" [tickCount]="5" (valueChange)="onStarRatingChange($event)"> </app-input-range>

<!-- Slider phần trăm với 10 tick marks -->
<app-input-range title="Phần trăm hoàn thành" [min]="0" [max]="100" [step]="5" [tickCount]="10" (valueChange)="onPercentageChange($event)"> </app-input-range>

<!-- Slider điểm số với tick marks tự động -->
<app-input-range title="Điểm số" [min]="0" [max]="10" [step]="1" (valueChange)="onScoreChange($event)"> </app-input-range>
```
