import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from '../../../core/services/toast.service';
import { of } from 'rxjs';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ToastService', ['remove'], {
      toasts$: of([]),
    });

    await TestBed.configureTestingModule({
      declarations: [ToastContainerComponent],
      providers: [{ provide: ToastService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    mockToastService = TestBed.inject(
      ToastService
    ) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toastService.remove when onToastClose is called', () => {
    const toastId = 'test-id';
    component.onToastClose(toastId);
    expect(mockToastService.remove).toHaveBeenCalledWith(toastId);
  });
});
