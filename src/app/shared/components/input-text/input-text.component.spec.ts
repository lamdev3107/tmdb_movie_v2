import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from './input-text.component';

describe('InputTextComponent', () => {
  let component: InputTextComponent;
  let fixture: ComponentFixture<InputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputTextComponent],
      imports: [FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.type).toBe('text');
    expect(component.placeholder).toBe('');
    expect(component.label).toBe('');
    expect(component.size).toBe('medium');
    expect(component.disabled).toBe(false);
    expect(component.required).toBe(false);
    expect(component.readonly).toBe(false);
  });

  it('should emit valueChange when input value changes', () => {
    const testValue = 'test input';
    spyOn(component.valueChange, 'emit');

    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = testValue;
    inputElement.dispatchEvent(new Event('input'));

    expect(component.valueChange.emit).toHaveBeenCalledWith(testValue);
  });

  it('should emit focus event when input is focused', () => {
    spyOn(component.focus, 'emit');

    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.dispatchEvent(new FocusEvent('focus'));

    expect(component.focus.emit).toHaveBeenCalled();
    expect(component.isFocused).toBe(true);
  });

  it('should emit blur event when input loses focus', () => {
    spyOn(component.blur, 'emit');

    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.dispatchEvent(new FocusEvent('blur'));

    expect(component.blur.emit).toHaveBeenCalled();
    expect(component.isFocused).toBe(false);
  });

  it('should apply correct CSS classes based on state', () => {
    component.size = 'large';
    component.disabled = true;
    component.isFocused = true;
    component.value = 'test';

    fixture.detectChanges();

    expect(component.inputClasses).toContain('input-text--large');
    expect(component.inputClasses).toContain('input-text--disabled');
    expect(component.inputClasses).toContain('input-text--focused');
    expect(component.inputClasses).toContain('input-text--has-value');
  });

  it('should implement ControlValueAccessor correctly', () => {
    const testValue = 'test value';
    let onChangeValue: string = '';
    let onTouchedCalled = false;

    component.registerOnChange((value: string) => {
      onChangeValue = value;
    });

    component.registerOnTouched(() => {
      onTouchedCalled = true;
    });

    component.writeValue(testValue);
    expect(component.value).toBe(testValue);

    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'new value';
    inputElement.dispatchEvent(new Event('input'));

    expect(onChangeValue).toBe('new value');

    inputElement.dispatchEvent(new FocusEvent('focus'));
    expect(onTouchedCalled).toBe(true);
  });

  it('should set disabled state correctly', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('should show label when provided', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    const labelElement =
      fixture.nativeElement.querySelector('.input-text__label');
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should show required indicator when required is true', () => {
    component.label = 'Test Label';
    component.required = true;
    fixture.detectChanges();

    const requiredElement = fixture.nativeElement.querySelector(
      '.input-text__required'
    );
    expect(requiredElement).toBeTruthy();
    expect(requiredElement.textContent).toBe('*');
  });

  it('should not show label when label is empty', () => {
    component.label = '';
    fixture.detectChanges();

    const labelElement =
      fixture.nativeElement.querySelector('.input-text__label');
    expect(labelElement).toBeFalsy();
  });
});
