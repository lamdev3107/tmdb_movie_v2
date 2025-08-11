import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SearchResponse } from '@features/client/search/models/search.model';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '@features/client/search/services/search.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  movieResults$!: Observable<SearchResponse>;
  currentPage!: number;
  totalPages!: number;
  query!: string;
  constructor(
    private route: ActivatedRoute,
    private serviceService: SearchService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const query = params['query'];
      if (query) {
        this.movieResults$ = this.serviceService.searchMovie(query!);
        this.query = query;
      } else {
        this.movieResults$ = this.serviceService.searchMovie('');
        this.query = '';
      }
      this.movieResults$.subscribe((data) => {
        this.totalPages = data.total_pages;
        this.currentPage = data.page;
      });
    });
  }

  onPageChange(page: number) {
    this.movieResults$ = this.serviceService.searchMovie(this.query, page);
  }
}
