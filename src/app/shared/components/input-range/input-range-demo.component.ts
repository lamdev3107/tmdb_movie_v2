import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RangeValue } from './input-range.component';

@Component({
  selector: 'app-input-range-demo',
  template: `
    <div class="demo-container">
      <h2>Input Range Component Demo</h2>

      <!-- Basic Usage -->
      <div class="demo-section">
        <h3>Basic Usage (Default Ticks)</h3>
        <app-input-range
          title="User Score"
          [min]="0"
          [max]="10"
          [step]="1"
          (valueChange)="onBasicRangeChange($event)"
        >
        </app-input-range>
        <p>Selected range: {{ basicRange | json }}</p>
      </div>

      <!-- Custom Tick Count -->
      <div class="demo-section">
        <h3>Custom Tick Count (5 ticks)</h3>
        <app-input-range
          title="Rating Range"
          [min]="1"
          [max]="5"
          [step]="0.5"
          [tickCount]="5"
          (valueChange)="onCustomRangeChange($event)"
        >
        </app-input-range>
        <p>Selected range: {{ customRange | json }}</p>
      </div>

      <!-- With Reactive Form -->
      <div class="demo-section">
        <h3>With Reactive Form (3 ticks)</h3>
        <form [formGroup]="form">
          <app-input-range
            title="Score Range"
            [min]="0"
            [max]="10"
            [step]="1"
            [tickCount]="3"
            formControlName="scoreRange"
          >
          </app-input-range>
        </form>
        <p>Form value: {{ form.value | json }}</p>
      </div>

      <!-- Percentage with 10 ticks -->
      <div class="demo-section">
        <h3>Percentage Range (10 ticks)</h3>
        <app-input-range
          title="Percentage"
          [min]="0"
          [max]="100"
          [step]="5"
          [tickCount]="10"
          (valueChange)="onPercentageRangeChange($event)"
        >
        </app-input-range>
        <p>Selected range: {{ percentageRange | json }}</p>
      </div>

      <!-- Disabled State -->
      <div class="demo-section">
        <h3>Disabled State</h3>
        <app-input-range
          title="Disabled Range"
          [min]="0"
          [max]="10"
          [step]="1"
          [disabled]="true"
        >
        </app-input-range>
      </div>

      <!-- Without Ticks and Labels -->
      <div class="demo-section">
        <h3>Without Ticks and Labels</h3>
        <app-input-range
          title="Clean Range"
          [min]="0"
          [max]="10"
          [step]="1"
          [showTicks]="false"
          [showLabels]="false"
          (valueChange)="onCleanRangeChange($event)"
        >
        </app-input-range>
        <p>Selected range: {{ cleanRange | json }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      h2 {
        color: #333;
        text-align: center;
        margin-bottom: 2rem;
      }

      .demo-section {
        margin-bottom: 3rem;
        padding: 2rem;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #fafafa;
      }

      h3 {
        color: #555;
        margin-bottom: 1rem;
        font-size: 1.4rem;
      }

      p {
        margin-top: 1rem;
        padding: 0.5rem;
        background: #fff;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class InputRangeDemoComponent implements OnInit {
  form: FormGroup;
  basicRange: RangeValue = { min: 0, max: 10 };
  customRange: RangeValue = { min: 1, max: 5 };
  percentageRange: RangeValue = { min: 0, max: 100 };
  cleanRange: RangeValue = { min: 0, max: 10 };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      scoreRange: [{ min: 0, max: 10 }],
    });
  }

  ngOnInit(): void {
    // Listen to form changes
    this.form.get('scoreRange')?.valueChanges.subscribe((value) => {
      console.log('Form range changed:', value);
    });
  }

  onBasicRangeChange(value: RangeValue): void {
    this.basicRange = value;
    console.log('Basic range changed:', value);
  }

  onCustomRangeChange(value: RangeValue): void {
    this.customRange = value;
    console.log('Custom range changed:', value);
  }

  onPercentageRangeChange(value: RangeValue): void {
    this.percentageRange = value;
    console.log('Percentage range changed:', value);
  }

  onCleanRangeChange(value: RangeValue): void {
    this.cleanRange = value;
    console.log('Clean range changed:', value);
  }
}
