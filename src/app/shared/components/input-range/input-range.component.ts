import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  ElementRef,
  ViewChild,
  forwardRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface RangeValue {
  min: number;
  max: number;
}

@Component({
  selector: 'app-input-range',
  templateUrl: './input-range.component.html',
  styleUrls: ['./input-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRangeComponent),
      multi: true,
    },
  ],
})
export class InputRangeComponent
  implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy
{
  @Input() title: string = '';
  @Input() min: number = 0;
  @Input() max: number = 10;
  @Input() step: number = 1;
  @Input() disabled: boolean = false;
  @Input() showTicks: boolean = true;
  @Input() showLabels: boolean = true;
  @Input() tickCount: number = 0; // 0 means show all ticks, > 0 means custom count

  @Output() valueChange = new EventEmitter<RangeValue>();

  @ViewChild('sliderTrack', { static: false })
  sliderTrack!: ElementRef<HTMLDivElement>;

  currentValue: RangeValue = { min: 0, max: 10 };
  ticks: number[] = [];
  majorTicks: number[] = [];
  isDragging: boolean = false;
  activeHandle: 'min' | 'max' | null = null;

  private destroy$ = new Subject<void>();
  private onChange = (value: RangeValue) => {};
  public onTouched = () => {};

  constructor() {}

  ngOnInit(): void {
    this.generateTicks();
    this.currentValue = { min: this.min, max: this.max };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateTrackColor();
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.activeHandle = null;
    }
  }

  @HostListener('document:touchend')
  onTouchEnd(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.activeHandle = null;
    }
  }

  generateTicks(): void {
    if (this.tickCount > 0) {
      // Custom tick count
      this.ticks = [];
      for (let i = 0; i <= this.tickCount; i++) {
        const value = this.min + (i / this.tickCount) * (this.max - this.min);
        this.ticks.push(Math.round(value));
      }

      // Major ticks for labels (first, middle, last)
      this.majorTicks = [
        this.ticks[0],
        this.ticks[Math.floor(this.ticks.length / 2)],
        this.ticks[this.ticks.length - 1],
      ];
    } else {
      // Show all ticks based on step
      this.ticks = Array.from(
        { length: Math.floor((this.max - this.min) / this.step) + 1 },
        (_, i) => this.min + i * this.step
      );

      // Major ticks for labels (0, 5, 10)
      this.majorTicks = [
        this.min,
        Math.floor((this.max + this.min) / 2),
        this.max,
      ];
    }
  }

  onTrackClick(event: MouseEvent): void {
    if (this.disabled) return;

    const rect = this.sliderTrack.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const trackWidth = rect.width;
    const clickPercent = (clickX / trackWidth) * 100;

    const clickValue = this.min + (clickPercent / 100) * (this.max - this.min);
    const roundedValue = Math.round(clickValue / this.step) * this.step;

    // Determine which handle to move based on click position
    const minPercent =
      ((this.currentValue.min - this.min) / (this.max - this.min)) * 100;
    const maxPercent =
      ((this.currentValue.max - this.min) / (this.max - this.min)) * 100;

    if (clickPercent < minPercent) {
      // Click is to the left of min handle
      this.updateMinValue(roundedValue);
    } else if (clickPercent > maxPercent) {
      // Click is to the right of max handle
      this.updateMaxValue(roundedValue);
    } else {
      // Click is between handles, move the closer one
      const distanceToMin = Math.abs(clickPercent - minPercent);
      const distanceToMax = Math.abs(clickPercent - maxPercent);

      if (distanceToMin < distanceToMax) {
        this.updateMinValue(roundedValue);
      } else {
        this.updateMaxValue(roundedValue);
      }
    }
  }

  onMinHandleMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDragging = true;
    this.activeHandle = 'min';
    this.onTouched();
  }

  onMaxHandleMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDragging = true;
    this.activeHandle = 'max';
    this.onTouched();
  }

  onMinHandleTouchStart(event: TouchEvent): void {
    event.stopPropagation();
    this.isDragging = true;
    this.activeHandle = 'min';
    this.onTouched();
  }

  onMaxHandleTouchStart(event: TouchEvent): void {
    event.stopPropagation();
    this.isDragging = true;
    this.activeHandle = 'max';
    this.onTouched();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.activeHandle) return;

    const rect = this.sliderTrack.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const trackWidth = rect.width;
    const mousePercent = (mouseX / trackWidth) * 100;

    const mouseValue = this.min + (mousePercent / 100) * (this.max - this.min);
    const roundedValue = Math.round(mouseValue / this.step) * this.step;

    if (this.activeHandle === 'min') {
      this.updateMinValue(roundedValue);
    } else if (this.activeHandle === 'max') {
      this.updateMaxValue(roundedValue);
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || !this.activeHandle) return;

    const touch = event.touches[0];
    const rect = this.sliderTrack.nativeElement.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const trackWidth = rect.width;
    const touchPercent = (touchX / trackWidth) * 100;

    const touchValue = this.min + (touchPercent / 100) * (this.max - this.min);
    const roundedValue = Math.round(touchValue / this.step) * this.step;

    if (this.activeHandle === 'min') {
      this.updateMinValue(roundedValue);
    } else if (this.activeHandle === 'max') {
      this.updateMaxValue(roundedValue);
    }
  }

  updateMinValue(newMin: number): void {
    const clampedMin = Math.max(
      this.min,
      Math.min(newMin, this.currentValue.max - this.step)
    );

    if (clampedMin !== this.currentValue.min) {
      this.currentValue.min = clampedMin;
      this.updateTrackColor();
      this.emitValue();
      this.onChange(this.currentValue);
    }
  }

  updateMaxValue(newMax: number): void {
    const clampedMax = Math.min(
      this.max,
      Math.max(newMax, this.currentValue.min + this.step)
    );

    if (clampedMax !== this.currentValue.max) {
      this.currentValue.max = clampedMax;
      this.updateTrackColor();
      this.emitValue();
      this.onChange(this.currentValue);
    }
  }

  updateTrackColor(): void {
    if (!this.sliderTrack) return;

    const minPercent =
      ((this.currentValue.min - this.min) / (this.max - this.min)) * 100;
    const maxPercent =
      ((this.currentValue.max - this.min) / (this.max - this.min)) * 100;

    this.sliderTrack.nativeElement.style.background = `linear-gradient(to right, #404040 0%, #404040 ${minPercent}%, #e50000 ${minPercent}%, #e50000 ${maxPercent}%, #404040 ${maxPercent}%, #404040 100%)`;
  }

  emitValue(): void {
    this.valueChange.emit(this.currentValue);
  }

  // ControlValueAccessor implementation
  writeValue(value: RangeValue): void {
    if (value && typeof value === 'object') {
      this.currentValue = { ...value };
      this.updateTrackColor();
    }
  }

  registerOnChange(fn: (value: RangeValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  isMajorTick(tick: number): boolean {
    return this.majorTicks.includes(tick);
  }

  getMinHandlePosition(): string {
    const percent =
      ((this.currentValue.min - this.min) / (this.max - this.min)) * 100;
    return `${percent}%`;
  }

  getMaxHandlePosition(): string {
    const percent =
      ((this.currentValue.max - this.min) / (this.max - this.min)) * 100;
    return `${percent}%`;
  }
}
