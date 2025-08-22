import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ListMovieResponse, Movie, TrailerItem } from '../models/movie.model';
import { Cast, CreditsResponse } from '../models/credit.model';
import { Keyword, KeywordResponse } from '../models/keyword.model';
import { ImagesResponse } from '../models/images.model';
import { Video, VideoResponse } from '../models/video.model';
import { Account, AccountStates } from '@core/models/account.model';
import { ReviewResponse } from '@core/models/review.model';
import { environment } from '@environments/environment';
import { MovieResponseData } from '@features/admin/movies/models/movie.model';

export interface queryListMovie {
  language: string;
  page: number;
  region: string;
}
export enum MovieCategoryEnum {
  POPULAR = 'popular',
  TOP_RATED = 'top-rated',
}
export enum queryListMovieEnum {
  language = 'en-US',
  page = 1,
  region = '',
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = environment.backendUrl + 'movies';
  private params = {
    language: queryListMovieEnum.language,
    page: queryListMovieEnum.page,
    region: queryListMovieEnum.region,
  };
  constructor(private http: HttpClient) {}

  ratingMovie(id: number, value: number): Observable<any> {
    const params = new HttpParams();
    const body = {
      value: value,
    };
    return this.http.post(`${this.baseUrl}/${id}/rating`, body, { params });
  }
  getMovies(
    page: number = 1,
    size: number = 30,
    keyword: string = ''
  ): Observable<MovieResponseData[]> {
    return this.http
      .get<MovieResponseData[]>(
        `${this.baseUrl}/searchByTitle?page=${page}&size=${size}&keyword=${keyword}`
      )
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }
  getMoviesByCategory(
    category: MovieCategoryEnum,
    page: number = 1
  ): Observable<any> {
    this.params.page = page;
    return this.http.get<any>(`${this.baseUrl}/${category}`, {
      params: this.params,
    });
  }

  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${movieId}`, {
      params: this.params,
    });
  }

  getTrendingMovies(
    time_window: string = 'day'
  ): Observable<ListMovieResponse> {
    return this.http.get<ListMovieResponse>(
      `${environment.apiUrl}trending/movie/${time_window}`,
      {
        params: this.params,
      }
    );
  }

  // Load trailer từ popular hoặc now_playing
  getLatestTrailers(
    source: 'popular' | 'now_playing' = 'popular',
    count: number = 10
  ): Observable<TrailerItem[]> {
    const url = `${this.baseUrl}/${source}`;

    return this.http.get<ListMovieResponse>(url, { params: this.params }).pipe(
      switchMap((res) => {
        const movies = res.results.slice(0, count);
        // Sử dụng service getMovieTrailer cho từng movie
        const trailerRequests = movies.map((movie: any) =>
          this.getMovieTrailer(movie.id).pipe(
            // Bổ sung backdrop_path từ movie gốc nếu cần
            map((trailer: TrailerItem | null) => {
              if (!trailer) return null;
              // Nếu trailer.backdrop_path chưa có, gán từ movie
              return {
                ...trailer,
                backdrop_path: trailer.backdrop_path || movie.backdrop_path,
                title: movie.title || movie.name || trailer.title,
              } as TrailerItem;
            })
          )
        );

        return forkJoin(trailerRequests).pipe(
          map(
            (trailers: any) =>
              trailers.filter((t: any) => t !== null) as TrailerItem[]
          )
        );
      })
    );
  }

  getMovieTrailer(id: number): Observable<TrailerItem | null> {
    const url = `${this.baseUrl}/${id}/videos`;
    const videos = this.http.get<TrailerItem>(url, { params: this.params });
    return videos.pipe(
      map((res: any) => {
        const trailer = res.results.find(
          (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        if (!trailer) return null;
        return {
          id: Number(id), // ép kiểu về number
          title: trailer.name,
          description: trailer.name,
          videoKey: trailer.key,
          youtubeUrl: `https://www.youtube.com/embed/${trailer.key}`,
          thumbnail: `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`,
          backdrop_path: trailer.backdrop_path,
        } as TrailerItem;
      })
    );
  }

  // Hàm lấy danh sách credits dành
  getMovieCredits(movieId: number): Observable<CreditsResponse> {
    const url = `${this.baseUrl}/${movieId}/credits`; // Sửa URL đúng
    return this.http.get<CreditsResponse>(url, { params: this.params });
  }

  getTopBilledCast(movieId: number, count = 10): Observable<Cast[]> {
    const url = `${this.baseUrl}/${movieId}/credits`; // Sửa URL đúng

    return this.http
      .get<CreditsResponse>(url, { params: this.params })
      .pipe(
        map((res) => res.cast.sort((a, b) => a.order - b.order).slice(0, count))
      );
  }

  getMovieKeywords(movieId: number): Observable<Keyword[]> {
    const url = `${this.baseUrl}/${movieId}/keywords`;
    return this.http
      .get<KeywordResponse>(url, { params: this.params })
      .pipe(map((res) => res.keywords));
  }

  getMovieReviews(
    movieId: number,
    page: number = 1
  ): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/${movieId}/reviews`;
    const params = { ...this.params, page };
    return this.http.get<ReviewResponse>(url, { params });
  }

  getMovieRecommendations(
    movieId: number,
    page: number,
    size: number = 5
  ): Observable<any[]> {
    const url = `${this.baseUrl}/recommendation/${movieId}`;
    const params = { page, size };

    return this.http.get<any>(url, { params });
  }

  getMovieAccountStates(movieId: number): Observable<AccountStates> {
    const url = `${this.baseUrl}/${movieId}/account_states`;
    return this.http
      .get<any>(url, { params: this.params })
      .pipe(map((res) => res.data));
  }

  searchGeneral(
    keyword: string,
    page: number = 1,
    size: number = 10
  ): Observable<any> {
    const url = `${this.baseUrl}/searchGeneral`;
    const params = { keyword: keyword, page, size };
    return this.http.get<any>(url, { params });
  }

  searchMovie(
    filters: {
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
      genreIds?: string; // VD: "28,12"
      fromReleaseDate?: string; // YYYY-MM-DD
      toReleaseDate?: string;
      languageIds?: string;
      countryIds?: string;
      // title?: string;
      page?: number;
      minRuntime?: number;
      maxRuntime?: number;
      minVoteAverage?: number;
      maxVoteAverage?: number;
    },
    page: number,
    size: number = 10
  ): Observable<any> {
    const url = `${this.baseUrl}/search`;
    let params = new HttpParams();
    console.log(filters);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortDirection)
      params = params.set('sortDirection', filters.sortDirection);
    if (filters.genreIds) params = params.set('genreIds', filters.genreIds);
    if (filters.fromReleaseDate)
      params = params.set('fromReleaseDate', filters.fromReleaseDate);
    if (filters.toReleaseDate)
      params = params.set('toReleaseDate', filters.toReleaseDate);
    if (filters.languageIds)
      params = params.set('languageIds', filters.languageIds);
    if (filters.countryIds)
      params = params.set('countryIds', filters.countryIds);
    if (filters.minRuntime !== undefined)
      params = params.set('minRuntime', filters.minRuntime);
    if (filters.maxRuntime !== undefined)
      params = params.set('maxRuntime', filters.maxRuntime);
    // if (filters.title) params = params.set('maxRuntime', filters.title);
    if (filters.minVoteAverage !== undefined)
      params = params.set('minVoteAverage', filters.minVoteAverage);
    if (filters.maxVoteAverage)
      params = params.set('maxVoteAverage', filters.maxVoteAverage);
    params = params.set('page', page);
    params = params.set('size', size);

    return this.http.get(url, { params: params });
  }
}
