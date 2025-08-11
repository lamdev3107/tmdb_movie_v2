import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ToastItem } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() toast!: ToastItem;
  @Output() close = new EventEmitter<string>();

  private timeoutId?: number;

  ngOnInit(): void {
    if (this.toast.duration && this.toast.duration > 0) {
      this.timeoutId = window.setTimeout(() => {
        this.close.emit(this.toast.id);
      }, this.toast.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onClose(): void {
    this.close.emit(this.toast.id);
  }

  getIconClass(): string {
    switch (this.toast.type) {
      case 'success':
        return 'icon-success';
      case 'error':
        return 'icon-error';
      case 'warning':
        return 'icon-warning';
      case 'info':
        return 'icon-info';
      default:
        return '';
    }
  }

  getIconPath(): string {
    switch (this.toast.type) {
      case 'success':
        return 'assets/icons/check.svg';
      case 'error':
        return 'assets/icons/close.svg';
      case 'warning':
        return 'assets/icons/warning.svg';
      case 'info':
        return 'assets/icons/info.svg';
      default:
        return '';
    }
  }
}
