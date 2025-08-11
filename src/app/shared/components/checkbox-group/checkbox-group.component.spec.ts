import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CheckboxGroupComponent,
  CheckboxOption,
} from './checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if option is selected', () => {
    component.selectedValues = [1, 2];

    expect(component.isOptionSelected(1)).toBe(true);
    expect(component.isOptionSelected(3)).toBe(false);
  });

  it('should toggle option selection', () => {
    const option: CheckboxOption = { value: 1, label: 'Test Option' };
    component.selectedValues = [];
    spyOn(component.onSelectionChange, 'emit');

    // Select option
    component.toggleOption(option);
    expect(component.selectedValues).toContain(1);
    expect(component.onSelectionChange.emit).toHaveBeenCalledWith([1]);

    // Deselect option
    component.toggleOption(option);
    expect(component.selectedValues).not.toContain(1);
    expect(component.onSelectionChange.emit).toHaveBeenCalledWith([]);
  });

  it('should not toggle disabled option', () => {
    const option: CheckboxOption = {
      value: 1,
      label: 'Test Option',
      disabled: true,
    };
    component.selectedValues = [];
    spyOn(component.onSelectionChange, 'emit');

    component.toggleOption(option);
    expect(component.selectedValues).not.toContain(1);
    expect(component.onSelectionChange.emit).not.toHaveBeenCalled();
  });

  it('should not toggle when component is disabled', () => {
    const option: CheckboxOption = { value: 1, label: 'Test Option' };
    component.disabled = true;
    component.selectedValues = [];
    spyOn(component.onSelectionChange, 'emit');

    component.toggleOption(option);
    expect(component.selectedValues).not.toContain(1);
    expect(component.onSelectionChange.emit).not.toHaveBeenCalled();
  });

  it('should respect maxSelections limit', () => {
    const option1: CheckboxOption = { value: 1, label: 'Option 1' };
    const option2: CheckboxOption = { value: 2, label: 'Option 2' };
    const option3: CheckboxOption = { value: 3, label: 'Option 3' };

    component.maxSelections = 2;
    component.selectedValues = [1, 2];
    spyOn(component.onSelectionChange, 'emit');

    component.toggleOption(option3);
    expect(component.selectedValues).toEqual([1, 2]);
    expect(component.onSelectionChange.emit).not.toHaveBeenCalled();
  });

  it('should return correct container class', () => {
    component.layout = 'vertical';
    expect(component.getContainerClass()).toBe(
      'checkbox-group-container vertical'
    );

    component.layout = 'horizontal';
    expect(component.getContainerClass()).toBe(
      'checkbox-group-container horizontal'
    );
  });

  it('should return correct option class', () => {
    const option: CheckboxOption = { value: 1, label: 'Test Option' };
    component.selectedValues = [1];

    const optionClass = component.getOptionClass(option);
    expect(optionClass).toContain('checkbox-option');
    expect(optionClass).toContain('selected');
    expect(optionClass).not.toContain('disabled');
  });

  it('should return correct option class for disabled option', () => {
    const option: CheckboxOption = {
      value: 1,
      label: 'Test Option',
      disabled: true,
    };

    const optionClass = component.getOptionClass(option);
    expect(optionClass).toContain('checkbox-option');
    expect(optionClass).toContain('disabled');
  });

  it('should check if can select more options', () => {
    component.maxSelections = 3;
    component.selectedValues = [1, 2];

    expect(component.canSelectMore()).toBe(true);

    component.selectedValues = [1, 2, 3];
    expect(component.canSelectMore()).toBe(false);
  });

  it('should always allow selection when no maxSelections', () => {
    component.maxSelections = undefined;
    component.selectedValues = [1, 2, 3, 4, 5];

    expect(component.canSelectMore()).toBe(true);
  });
});
