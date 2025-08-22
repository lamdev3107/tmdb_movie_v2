import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SearchResponse } from '@features/client/search/models/search.model';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '@features/client/movies/services/movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  movieResults$!: Observable<any>;
  currentPage!: number;
  totalPages!: number;
  query!: string;
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const query = params['query'];
      if (query && query.trim() !== '') {
        this.movieResults$ = this.movieService.getMovies(
          this.currentPage,
          10,
          query!
        );
        this.query = query;
      } else {
        this.movieResults$ = new Observable((observer) => {
          observer.next({ data: [] });
          observer.complete();
        });

        this.query = '';
      }
      this.movieResults$.subscribe((data) => {
        this.totalPages = data.metaInfo.totalPages;
        this.currentPage = data.metaInfo.page;
      });
    });
  }

  onPageChange(page: number) {
    this.currentPage = page + 1;
    this.movieResults$ = this.movieService.getMovies(
      this.currentPage,
      10,
      this.query
    );
  }
}
