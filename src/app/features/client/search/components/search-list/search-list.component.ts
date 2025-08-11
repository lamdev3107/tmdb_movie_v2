import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchResponse } from '@features/client/search/models/search.model';
import { Observable } from 'rxjs';
interface SearchResults {
  data: SearchResponse | null;
}
@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
})
export class SearchListComponent implements OnInit, OnChanges {
  @Input() data!: SearchResponse;
  @Input() activeTabId!: 'movie' | 'tv' | 'person';
  @Output() onChangePage = new EventEmitter<number>();
  total_page!: number;
  currentPage!: number;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      console.log('data', this.data);
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.onChangePage.emit(this.currentPage);
  }
  constructor(private route: Router) {}
  ngOnInit(): void {}
}
