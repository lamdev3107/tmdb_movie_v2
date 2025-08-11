import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchResponse } from '@features/client/search/models/search.model';
import { SearchService } from '@features/client/search/services/search.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit {
  personResults$!: Observable<SearchResponse>;
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
        this.personResults$ = this.serviceService.searchPerson(query!);
        this.query = query;
      } else {
        this.personResults$ = this.serviceService.searchPerson('');
        this.query = '';
      }
      this.personResults$.subscribe((data) => {
        this.totalPages = data.total_pages;
        this.currentPage = data.page;
      });
    });
  }

  onPageChange(page: number) {
    this.personResults$ = this.serviceService.searchPerson(this.query, page);
  }
}
