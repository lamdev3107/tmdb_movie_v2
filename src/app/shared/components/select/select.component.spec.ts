import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display placeholder when no option is selected', () => {
    component.selectedOption = null;
    component.placeholder = 'Chọn tùy chọn';
    fixture.detectChanges();

    const displayValue = component.getDisplayValue();
    expect(displayValue).toBe('Chọn tùy chọn');
  });

  it('should display selected option label', () => {
    const selectedOption: SelectOption = { value: 1, label: 'Tùy chọn 1' };
    component.selectedOption = selectedOption;
    fixture.detectChanges();

    const displayValue = component.getDisplayValue();
    expect(displayValue).toBe('Tùy chọn 1');
  });

  it('should toggle dropdown when trigger is clicked', () => {
    component.disabled = false;
    component.isOpen = false;

    component.toggleDropdown();
    expect(component.isOpen).toBe(true);

    component.toggleDropdown();
    expect(component.isOpen).toBe(false);
  });

  it('should not toggle dropdown when disabled', () => {
    component.disabled = true;
    component.isOpen = false;

    component.toggleDropdown();
    expect(component.isOpen).toBe(false);
  });

  it('should emit selected option and close dropdown', () => {
    const option: SelectOption = { value: 1, label: 'Tùy chọn 1' };
    component.isOpen = true;
    spyOn(component.onSelectChange, 'emit');

    component.selectOption(option);

    expect(component.selectedOption).toEqual(option);
    expect(component.onSelectChange.emit).toHaveBeenCalledWith(option);
    expect(component.isOpen).toBe(false);
  });

  it('should close dropdown', () => {
    component.isOpen = true;

    component.closeDropdown();
    expect(component.isOpen).toBe(false);
  });
});
