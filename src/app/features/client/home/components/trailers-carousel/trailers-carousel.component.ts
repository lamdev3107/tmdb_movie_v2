import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import Swiper from 'swiper';
import { TrailerItem } from '@features/client/movies/models/movie.model';

@Component({
  selector: 'app-trailers-carousel',
  templateUrl: './trailers-carousel.component.html',
  styleUrls: ['./trailers-carousel.component.scss'],
})
export class TrailersCarouselComponent implements AfterViewInit {
  @Input() trailerList: TrailerItem[] = [];
  selectedTrailer: TrailerItem | null = null;
  openTrailerModal = false;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  currentPage = 0;
  slidesPerView = 4;

  swiperInstance!: Swiper;
  isBeginning: boolean = true;
  isEnd: boolean = false;
  config: SwiperOptions = {
    spaceBetween: 40,
    navigation: {
      nextEl: '.custom-carousel-btn--next',
      prevEl: '.custom-carousel-btn--prev',
    },
    loop: false,
    pagination: false,
    scrollbar: false,
    breakpoints: {
      // khi màn hình >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      // khi màn hình >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      // khi màn hình >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      // khi màn hình >= 1280px
      1280: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  };

  get totalPagesArray(): number[] {
    const slidesPerView = this.getCurrentSlidesPerView();
    return Array.from({
      length: Math.ceil(this.trailerList.length / slidesPerView),
    }).map((_, i) => i);
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.updateNavigationState();
  }

  ngAfterViewInit(): void {
    if (this.swiper) {
      this.swiperInstance = this.swiper.swiperRef;
      this.updateNavigationState();
    }
  }

  onSwiper(swiper: Swiper) {
    this.swiperInstance = swiper;
    this.currentPage = swiper.realIndex || 0;
    setTimeout(() => {
      this.updateNavigationState();
    }, 0);
  }

  onSlideChange() {
    this.updateNavigationState();
    if (this.swiper) {
      const index = this.swiper.swiperRef.activeIndex;
      const slidesPerView = this.getCurrentSlidesPerView();
      this.currentPage = Math.floor(index / slidesPerView);
    }
  }

  goToSlide(pageIndex: number) {
    const slidesPerView = this.getCurrentSlidesPerView();
    const targetIndex = pageIndex * slidesPerView;
    this.swiper?.swiperRef.slideTo(targetIndex, 300);
  }

  slideNext() {
    const slidesPerView = this.getCurrentSlidesPerView();
    const currentIndex = this.swiperInstance.activeIndex;
    const nextIndex = currentIndex + slidesPerView;
    const maxIndex = this.swiperInstance.slides.length - 1;

    this.swiperInstance.slideTo(
      Math.min(nextIndex, maxIndex),
      500 // speed
    );
    this.updateNavigationState();
  }

  slidePrev() {
    const slidesPerView = this.getCurrentSlidesPerView();
    const currentIndex = this.swiperInstance.activeIndex;
    const prevIndex = currentIndex - slidesPerView;

    this.swiperInstance.slideTo(Math.max(prevIndex, 0), 500);
    this.updateNavigationState();
  }

  updateNavigationState() {
    if (!this.swiperInstance) return;
    this.isBeginning = this.swiperInstance.isBeginning;
    this.isEnd = this.swiperInstance.isEnd;
    this.cdr.detectChanges();
  }

  getCurrentSlidesPerView(): number {
    if (this.swiperInstance && this.swiperInstance.params) {
      const spv = this.swiperInstance.params.slidesPerView;
      if (typeof spv === 'number') {
        return spv;
      }
    }
    return this.slidesPerView;
  }

  handleOnPlayTrailer(trailer: TrailerItem): void {
    this.selectedTrailer = trailer;
    this.openTrailerModal = true;
  }

  closeTrailerModal(): void {
    this.selectedTrailer = null;
    this.openTrailerModal = false;
  }
}
