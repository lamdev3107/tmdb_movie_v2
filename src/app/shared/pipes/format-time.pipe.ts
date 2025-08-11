import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let result = '';
    if (hours > 0) {
      result += `${hours}h`;
    }
    if (mins > 0) {
      result += (result ? ' ' : '') + `${mins}m`;
    }
    return result || '0m';
  }
}
