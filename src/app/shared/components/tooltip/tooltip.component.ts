import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
} from '@angular/core';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit, OnDestroy {
  @Input() text: string = '';
  @Input() position: TooltipPosition = 'top';
  @Input() delay: number = 200;
  @Input() maxWidth: string = '200px';
  @Input() showArrow: boolean = true;

  isVisible: boolean = false;
  private timeoutId?: number;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.timeoutId = window.setTimeout(() => {
      this.isVisible = true;
    }, this.delay);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.isVisible = false;
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  get tooltipClasses(): string {
    const classes = ['tooltip', `tooltip--${this.position}`];

    if (this.showArrow) {
      classes.push('tooltip--with-arrow');
    }

    return classes.join(' ');
  }

  get tooltipStyles(): { [key: string]: string } {
    return {
      'max-width': this.maxWidth,
    };
  }
}
