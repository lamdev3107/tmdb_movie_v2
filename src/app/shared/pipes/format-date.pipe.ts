import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const parts = value.split('-'); // ["2002", "08", "09"]
    if (parts.length !== 3) return value;

    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
}
