import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
})
export class ImageUrlPipe implements PipeTransform {
  imageBaseUrl = 'https://image.tmdb.org/t/p';

  transform(
    imagePath: string | undefined | null,
    width: number = 500,
    original: false
  ): string {
    if (original) {
      return `${this.imageBaseUrl}/original/${imagePath}`;
    }
    return `${this.imageBaseUrl}/w${width}/${imagePath}`;
  }
}
