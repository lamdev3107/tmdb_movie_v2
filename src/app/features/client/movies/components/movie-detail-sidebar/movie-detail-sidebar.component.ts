import { Language } from '@core/models/language.model';
import { Movie } from '../../models/movie.model';
import { Keyword } from './../../models/keyword.model';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Company } from '@core/models/company.model';

@Component({
  selector: 'app-movie-detail-sidebar',
  templateUrl: './movie-detail-sidebar.component.html',
  styleUrls: ['./movie-detail-sidebar.component.scss'],
})
export class MovieDetailSidebarComponent implements OnInit, OnChanges {
  @Input() movie!: Movie;
  constructor() {}
  languages: string = '';
  productionCompany: string = '';
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie']) {
      this.movie = changes['movie'].currentValue;
      this.languages = this.renderLanguage(this.movie.languages);
      this.productionCompany = this.renderProductionCompany(
        this.movie.companies
      );
      console.log('Check');
    }
  }

  renderLanguage(languages: Language[]) {
    return languages.map((language) => language.name).join(', ');
  }
  renderProductionCompany(productionCompanies: Company[]) {
    return productionCompanies
      .map((productionCompany) => productionCompany.name)
      .join(', ');
  }
  ngOnInit(): void {}
}
