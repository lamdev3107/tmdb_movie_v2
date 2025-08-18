import { ToastService } from './../../../../../core/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../../services/people.service';
import {
  AdminPerson,
  AdminPeopleResponseData,
} from '../../models/admin-person.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent implements OnInit {
  people: AdminPerson[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  loading = false;
  searchQuery = '';
  private debounceTimeout: any;

  constructor(
    private peopleService: PeopleService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(page: number = 1, size: number = 6, keyword: string = ''): void {
    this.loading = true;
    this.peopleService.getPeople(page, size, keyword).subscribe({
      next: (response: AdminPeopleResponseData) => {
        const { metaInfo, results } = response;
        this.people = results;
        this.currentPage = metaInfo.page;
        this.totalPages = metaInfo.totalPages;
        this.totalResults = metaInfo.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading people:', error);
        this.loading = false;
      },
    });
  }

  onSearchQueryChange(keyword: string): void {
    // Sử dụng debounce 500ms thì mới gọi loadPeople
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.searchQuery = keyword;
    this.debounceTimeout = setTimeout(() => {
      this.loadPeople(1, 6, this.searchQuery);
    }, 500);
  }

  handleClickAddBtn(): void {
    this.router.navigate(['/admin/people/create']);
  }

  onPageChange(page: number): void {
    this.currentPage = page++;
    this.loadPeople(this.currentPage, 6, this.searchQuery);
  }

  deletePerson(id: number): void {
    if (confirm(`Bạn có chắc chắn muốn xóa người nổi tiếng có id là ${id}?`)) {
      this.peopleService.deletePerson(id).subscribe({
        next: () => {
          this.toastService.success('Xóa người nổi tiếng thành công!');
          this.loadPeople();
        },
      });
    }
  }

  handleClickEditBtn(id: number): void {
    this.router.navigate(['/admin/people/edit', id]);
  }

  getGenderLabel(gender: string): string {
    switch (gender) {
      case 'MALE':
        return 'Nam';
      case 'FEMALE':
        return 'Nữ';
      case 'OTHER':
        return 'Khác';
      default:
        return gender;
    }
  }

  trackByPersonId(index: number, person: AdminPerson): number {
    return person.id;
  }
}
