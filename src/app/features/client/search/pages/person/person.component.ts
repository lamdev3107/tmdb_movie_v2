import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from '@features/admin/people/services/people.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit {
  personResults$!: Observable<any>;
  currentPage!: number;
  totalPages!: number;
  query!: string;
  constructor(
    private route: ActivatedRoute,
    private peopleService: PeopleService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const query = params['query'];
      if (query) {
        this.personResults$ = this.peopleService.getPeople(
          this.currentPage,
          10,
          query!
        );
        this.query = query;
      } else {
        this.personResults$ = new Observable((observer) => {
          observer.next({ data: [] });
          observer.complete();
        });
        this.query = '';
      }
      this.personResults$.subscribe((data) => {
        this.totalPages = data.metaInfo.totalPages;
        this.currentPage = data.metaInfo.page;
      });
    });
  }

  onPageChange(page: number) {
    this.currentPage = page + 1;
    this.personResults$ = this.peopleService.getPeople(
      this.currentPage,
      10,
      this.query
    );
  }
}
