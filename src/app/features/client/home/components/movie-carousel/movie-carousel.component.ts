import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';

import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import Swiper from 'swiper';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';
import { CardType } from '@core/utils/enums';
import { Movie } from '@features/client/movies/models/movie.model';

@Component({
  selector: 'app-movie-carousel',
  templateUrl: './movie-carousel.component.html',
  styleUrls: ['./movie-carousel.component.scss'],
})
export class MovieCarouselComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() movieList: Movie[] | undefined = [];
  @Input() tvShowList: TVShow[] | undefined = [];
  @Input() type: 'movie' | 'tv' = 'movie';

  // Thêm CardType để có thể sử dụng trong template
  cardType = CardType.MOVIE;

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  currentPage = 0;
  slidesPerView = 5;

  swiperInstance!: Swiper;
  isBeginning: boolean = true;
  isEnd: boolean = false;
  config: SwiperOptions = {
    slidesPerView: this.slidesPerView,
    spaceBetween: 40,
    navigation: {
      nextEl: '.custom-carousel-btn--next',
      prevEl: '.custom-carousel-btn--prev',
    },
    loop: false,
    pagination: false,
    scrollbar: false,
    // Responsive breakpoints
    breakpoints: {
      // khi màn hình >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      // khi màn hình >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      // khi màn hình >= 768px
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      // khi màn hình >= 1280px
      1280: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      1440: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
    },
  };

  get totalPagesArray(): number[] {
    let length = null;
    if (this.type === 'movie') {
      {
        length = this.movieList?.length;
      }
    }
    if (this.type === 'tv') {
      length = this.tvShowList?.length;
    }
    const slidesPerView = this.getCurrentSlidesPerView();
    return Array.from({
      length: Math.ceil((length as number) / slidesPerView),
    }).map((_, i) => i);
  }

  constructor(private cdr: ChangeDetectorRef) {}

  // Đây là một setter cho thuộc tính @Input() cardType.
  // Khi giá trị cardType được truyền từ component cha thay đổi,
  // setter này sẽ được gọi với giá trị mới (type: CardType).
  // Bên trong setter, giá trị mới được gán cho thuộc tính _cardType của component,
  // sau đó gọi this.cdr.detectChanges() để thông báo cho Angular cập nhật lại view nếu cần thiết.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && changes['type'].currentValue) {
      if (changes['type'].currentValue === 'tv') {
        this.cardType = CardType.TV_SHOW;
      }
      if (changes['type'].currentValue === 'tv') {
        this.cardType = CardType.TV_SHOW;
      }
    }
  }
  ngOnInit(): void {
    this.updateNavigationState();
  }

  ngAfterViewInit(): void {
    if (this.swiper) {
      this.swiperInstance = this.swiper.swiperRef;
      // Delay update để Swiper có thể tính toán isEnd đúng
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
}
