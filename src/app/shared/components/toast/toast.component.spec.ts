import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastItem } from '../../../core/services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  const mockToast: ToastItem = {
    id: '1',
    message: 'Test message',
    type: 'success',
    duration: 3000,
    showCloseButton: true,
    timestamp: Date.now(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    component.toast = mockToast;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the toast message', () => {
    const messageElement =
      fixture.nativeElement.querySelector('.toast__message');
    expect(messageElement.textContent).toContain('Test message');
  });

  it('should emit close event when close button is clicked', () => {
    spyOn(component.close, 'emit');
    const closeButton = fixture.nativeElement.querySelector('.toast__close');
    closeButton.click();
    expect(component.close.emit).toHaveBeenCalledWith('1');
  });

  it('should auto-close after duration', (done) => {
    const shortDurationToast: ToastItem = {
      ...mockToast,
      duration: 100,
    };
    component.toast = shortDurationToast;
    spyOn(component.close, 'emit');

    setTimeout(() => {
      expect(component.close.emit).toHaveBeenCalledWith('1');
      done();
    }, 150);
  });
});
