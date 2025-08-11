import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertPercent',
})
export class ConvertPercentPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (!value) return '';
    const percent = Math.round(value * 10);
    return `${percent}%`;
  }
}
