import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchResponse } from '@features/client/search/models/search.model';
import { SearchService } from '@features/client/search/services/search.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss'],
})
export class TvComponent implements OnInit {
  tvResults$!: Observable<SearchResponse>;
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
        this.tvResults$ = this.serviceService.searchTV(query!);
        this.query = query;
      } else {
        this.tvResults$ = this.serviceService.searchTV('');
        this.query = '';
      }
      this.tvResults$.subscribe((data) => {
        this.totalPages = data.total_pages;
        this.currentPage = data.page;
      });
    });
  }

  onPageChange(page: number) {
    this.tvResults$ = this.serviceService.searchTV(this.query, page);
  }
}
