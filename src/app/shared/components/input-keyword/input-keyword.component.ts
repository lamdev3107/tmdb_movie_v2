import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { KeywordService } from '@core/services/keyword.service';

@Component({
  selector: 'app-input-keyword',
  templateUrl: './input-keyword.component.html',
  styleUrls: ['./input-keyword.component.scss'],
})
export class InputKeywordComponent implements OnInit {
  keywordControl = new FormControl('');
  suggestions: any[] = [];
  selectedKeywords: any[] = [];
  @Output() keywordsChange = new EventEmitter<number[]>();

  constructor(private keywordService: KeywordService) {}

  ngOnInit() {
    this.keywordControl.valueChanges
      .pipe(
        debounceTime(600), // Chờ 300ms
        distinctUntilChanged(), // Chỉ call khi giá trị thay đổi
        filter((query) => query && query.length > 1), // Chỉ search khi >1 ký tự
        switchMap((query) => this.keywordService.searchKeyword(query))
      )
      .subscribe((res) => {
        this.suggestions = res.results;
        console.log('check res', this.suggestions);
      });
  }

  addKeyword(keyword: any) {
    if (!this.selectedKeywords.some((k) => k.id === keyword.id)) {
      this.selectedKeywords.push(keyword);
      this.emitKeywords();
    }
    this.keywordControl.setValue('');
    this.suggestions = [];
  }

  removeKeyword(keywordId: number) {
    this.selectedKeywords = this.selectedKeywords.filter(
      (k) => k.id !== keywordId
    );
    this.emitKeywords();
  }
  private emitKeywords() {
    this.keywordsChange.emit(this.selectedKeywords.map((k) => k.id));
  }
}
