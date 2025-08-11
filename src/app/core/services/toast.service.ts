import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  showCloseButton?: boolean;
}

export interface ToastItem extends ToastConfig {
  id: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = new BehaviorSubject<ToastItem[]>([]);
  public toasts$ = this.toasts.asObservable();

  constructor() {}

  show(config: ToastConfig): string {
    const toast: ToastItem = {
      ...config,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, toast]);

    return toast.id;
  }

  success(message: string, duration: number = 3000): string {
    return this.show({
      message,
      type: 'success',
      duration,
      showCloseButton: true,
    });
  }

  error(message: string, duration: number = 3000): string {
    return this.show({
      message,
      type: 'error',
      duration,
      showCloseButton: true,
    });
  }

  warning(message: string, duration: number = 3000): string {
    return this.show({
      message,
      type: 'warning',
      duration,
      showCloseButton: true,
    });
  }

  info(message: string, duration: number = 3000): string {
    return this.show({
      message,
      type: 'info',
      duration,
      showCloseButton: true,
    });
  }

  remove(id: string): void {
    const currentToasts = this.toasts.value;
    const filteredToasts = currentToasts.filter((toast) => toast.id !== id);
    this.toasts.next(filteredToasts);
  }

  clear(): void {
    this.toasts.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
