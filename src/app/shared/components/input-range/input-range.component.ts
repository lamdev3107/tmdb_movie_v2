import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-input-range',
  templateUrl: './input-range.component.html',
  styleUrls: ['./input-range.component.scss'],
})
export class InputRangeComponent implements OnInit, AfterViewInit {
  @Input() initMinValue: number = 0;
  @Input() initMaxValue: number = 100;
  @Input() step: number = 1;
  @Input() tooltipText: string = 'Input Range';
  @Input() labels: string[] = ['0', '50', '100'];

  @Output() onChangeMinValue = new EventEmitter<number>();
  @Output() onChangeMaxValue = new EventEmitter<number>();

  @ViewChild('sliderOne', { static: false })
  sliderOne!: ElementRef<HTMLInputElement>;
  @ViewChild('sliderTwo', { static: false })
  sliderTwo!: ElementRef<HTMLInputElement>;
  @ViewChild('sliderTrack', { static: false })
  sliderTrack!: ElementRef<HTMLDivElement>;

  minValue: number = 30;
  maxValue: number = 70;
  ticks: number[] = [];
  isShowTooltip: boolean = false;
  tooltipTimeout: any;
  minGap: number = 0;

  constructor() {}
  ngOnInit(): void {
    this.minValue = this.initMinValue;
    this.maxValue = this.initMaxValue;
    this.ticks = Array.from(
      { length: this.initMaxValue - this.initMinValue + 1 },
      (_, i) => i
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onMinValueChange();
      this.onMaxValueChange();
    }, 0);
  }

  showTooltipForAWhile() {
    this.isShowTooltip = true;
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    this.tooltipTimeout = setTimeout(() => {
      this.isShowTooltip = false;
    }, 1000);
  }

  onMinValueChange() {
    if (this.minValue - this.maxValue <= this.minGap) {
      this.minValue = this.maxValue - this.minGap;
    }
    this.minValue = parseInt(this.sliderOne.nativeElement.value);
    this.fillColor();
    this.onChangeMinValue.emit(this.minValue);
    this.showTooltipForAWhile();
  }

  onMaxValueChange() {
    if (
      parseInt(this.sliderTwo.nativeElement.value) -
        parseInt(this.sliderOne.nativeElement.value) <=
      this.minGap
    ) {
      this.sliderTwo.nativeElement.value = (
        parseInt(this.sliderOne.nativeElement.value) + this.minGap
      ).toString();
    }
    this.maxValue = parseInt(this.sliderTwo.nativeElement.value);
    this.fillColor();
    this.onChangeMaxValue.emit(this.maxValue);
    this.showTooltipForAWhile();
  }

  fillColor() {
    const sliderMaxValue = parseInt(this.sliderOne.nativeElement.max);
    const percent1 =
      (parseInt(this.sliderOne.nativeElement.value) / sliderMaxValue) * 100;
    const percent2 =
      (parseInt(this.sliderTwo.nativeElement.value) / sliderMaxValue) * 100;
    this.sliderTrack.nativeElement.style.background = `linear-gradient(to right, #4c4c4c ${percent1}% , #e50000 ${percent1}% , #e50000 ${percent2}%, #4c4c4c ${percent2}%)`;
  }
}
