import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import {
  PeopleResponse,
  Person,
} from '@features/client/people/models/person.model';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { CardType } from '@core/utils/enums';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  people: Person[] = [];
  currentPage: number = 1;
  totalPages = 0;
  cardType = CardType.CAST;
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng ký

  constructor(
    private peopleService: PeopleService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadPeople(this.currentPage);
  }

  loadPeople(page: number) {
    this.loadingService.show();
    this.peopleService
      .getPopularPeople(page)
      .pipe(
        take(1),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.people = res.results;
          this.totalPages = res.total_pages;
          this.currentPage = res.page;
        },
        error: (err) => {
          console.log('Error fetching people!');
        },
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPeople(page);
  }
}
