import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Movie } from '@features/client/movies/models/movie.model';
import { MovieService } from '@features/client/movies/services/movie.service';
import { Person } from '@features/client/people/models/person.model';
import { SearchResponse } from '@features/client/search/models/search.model';
import { SearchService } from '@features/client/search/services/search.service';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';
import { TabItem } from '@shared/components/tab/tab.component';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs';

interface ApiState<T> {
  loading: boolean;
  data?: T;
}
interface SearchResults {
  loading: boolean;
  suggestions: {
    multi: SearchResponse | null;
    movie: SearchResponse | null;
    tv: SearchResponse | null;
    person: SearchResponse | null;
  };
}
@Component({
  selector: 'app-search-layout',
  templateUrl: './search-layout.component.html',
  styleUrls: ['./search-layout.component.scss'],
})
export class SearchLayoutComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchContainer') searchContainer!: ElementRef<HTMLElement>;
  searchQuery!: string;
  suggestion$!: Observable<SearchResults>;
  trendingResults$!: Observable<ApiState<Movie[]>>;

  isShowTrending = false;
  isShowResult = false;
  debounceTimeout: any;
  activeTabId = 'movie';

  searchTabs: TabItem[] = [
    { id: 'movie', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'person', label: 'People' },
  ];

  // Sử dụng BehaviorSubject để quản lý query
  private querySubject = new BehaviorSubject<string>('');
  query$ = this.querySubject.asObservable();

  constructor(
    private movieService: MovieService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Theo dõi route changes để cập nhật active tab
    this.route.url.subscribe((segments) => {
      if (segments.length > 0) {
        const currentRoute = segments[0].path;
        if (
          currentRoute === 'movie' ||
          currentRoute === 'tv' ||
          currentRoute === 'person'
        ) {
          this.activeTabId = currentRoute;
        }
      }
    });

    // Khi query$ thay đổi thì gọi dữ liệu search
    this.suggestion$ = this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query || query.trim() === '') {
          return of({
            loading: false,
            suggestions: {
              multi: null,
              movie: null,
              tv: null,
              person: null,
            },
          } as SearchResults);
        }
        return combineLatest([
          this.searchService.searchMulti(query),
          this.searchService.searchMovie(query),
          this.searchService.searchTV(query),
          this.searchService.searchPerson(query),
        ]).pipe(
          map(
            ([multi, movie, tv, person]) =>
              ({
                loading: false,
                suggestions: {
                  multi: multi,
                  movie: movie,
                  tv: tv,
                  person: person,
                },
              } as SearchResults)
          ),
          startWith({
            loading: true,
            suggestions: {
              multi: null,
              movie: null,
              tv: null,
              person: null,
            },
          } as SearchResults)
        );
      })
    );
  }

  onSearch() {
    this.isShowResult = false;
    this.searchQuery = this.searchInput.nativeElement.value;
    this.router.navigate([`search/movie`], {
      queryParams: { query: this.searchQuery },
      state: { data: this.searchQuery },
    });
  }
  onClickItem(queryObj: { media_type: string; query: string }) {
    const { media_type, query } = queryObj;
    this.querySubject.next(query);
    this.searchInput.nativeElement.value = query;
    this.router.navigate([`search/${media_type}`], {
      queryParams: { query },
      state: { data: query },
    });
    this.activeTabId = media_type;
    this.isShowResult = false;
  }

  onTabChange(tabId: string) {
    this.activeTabId = tabId;
    // Lấy query hiện tại từ querySubject và truyền vào navigate
    const currentQuery = this.querySubject.getValue();
    this.router.navigate([`search/${tabId}`], {
      queryParams: { query: currentQuery },
      state: { data: currentQuery },
    });
  }

  settingTrengdingData() {
    this.trendingResults$ = this.movieService.getTrendingMovies().pipe(
      map((res) => ({ loading: false, data: res.results.slice(0, 8) })),
      startWith({ loading: true } as ApiState<any[]>)
    );
  }

  onInput(event: Event) {
    const inputElement = event?.target as HTMLInputElement;
    if (inputElement) {
      this.querySubject.next(inputElement.value);
      if (inputElement.value.trim() === '') {
        this.isShowTrending = true;
        this.settingTrengdingData();
      } else {
        this.isShowTrending = false;
      }
    }
  }

  clearInput() {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.dispatchEvent(new Event('input'));
    }
  }

  onFocus() {
    this.isShowResult = true;
    if (
      this.searchInput &&
      this.searchInput.nativeElement.value.trim() === ''
    ) {
      this.isShowTrending = true;
      this.settingTrengdingData();
    }
  }

  getTotalResult(item: any) {}

  getItemTitle(item: Movie | TVShow | Person): string {
    if ('title' in item) {
      return item.title;
    } else if ('name' in item) {
      return item.name;
    }
    return '';
  }

  renderMediaTypeIcon(mediaType: string): string {
    switch (mediaType) {
      case 'tv':
        return 'assets/icons/tv.svg';
      case 'movie':
        return 'assets/icons/film.svg';
      default:
        return 'assets/icons/user-solid.svg';
    }
  }

  getMediaType(item: any): string {
    return item.media_type || 'movie';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (
      this.searchContainer &&
      !this.searchContainer.nativeElement.contains(event.target as Node)
    ) {
      this.isShowResult = false;
    }
  }
}
