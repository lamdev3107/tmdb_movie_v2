import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeYoutubeUrl',
})
export class SafeYoutubeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(youtubeKey: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${youtubeKey}`
    );
  }
}
