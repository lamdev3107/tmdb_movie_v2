import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() maxVisiblePages: number = 5;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];
    const start = Math.max(
      1,
      this.currentPage - Math.floor(this.maxVisiblePages / 2)
    );
    const end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  get showStartEllipsis(): boolean {
    return this.currentPage - Math.floor(this.maxVisiblePages / 2) > 1;
  }

  get showEndEllipsis(): boolean {
    return (
      this.currentPage + Math.floor(this.maxVisiblePages / 2) < this.totalPages
    );
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  onPageClick(page: number): void {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onPreviousClick(): void {
    if (this.canGoPrevious) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNextClick(): void {
    if (this.canGoNext) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
