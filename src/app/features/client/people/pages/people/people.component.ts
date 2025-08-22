import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import {
  PeopleResponse,
  Person,
} from '@features/client/people/models/person.model';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { CardType } from '@core/utils/enums';
import { PeopleService } from '../../services/people.service';
import { AdminPerson } from '@features/admin/people/models/admin-person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  people: AdminPerson[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages = 0;
  keyword: string = '';
  career: string = '';
  cardType = CardType.CAST;
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng ký

  constructor(
    private peopleService: PeopleService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadPeople(this.currentPage, this.pageSize, this.keyword, this.career);
  }

  loadPeople(page: number, pageSize: number, keyword: string, career: string) {
    this.loadingService.show();
    this.peopleService
      .getPeople(page, pageSize, keyword, career)
      .pipe(
        take(1),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.people = res.results;
          this.totalPages = res.metaInfo.totalPages;
          this.currentPage = res.metaInfo.page;
        },
        error: (err) => {
          console.log('Error fetching people!');
        },
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPeople(this.currentPage, this.pageSize, this.keyword, this.career);
  }
}
