import {
  ConfigurationService,
  Country,
  Language,
} from '../../../../../core/services/configuration.service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { GenreListResponse } from '@core/models/genre.model';
import { GenreService } from '@core/services/genre.service';
import { SelectOption } from '@shared/components/select/select.component';
import { ToggleSelectBox } from '@shared/components/toggle-select-box-list/toggle-select-box-list.component';

@Component({
  selector: 'app-movie-filter',
  templateUrl: './movie-filter.component.html',
  styleUrls: ['./movie-filter.component.scss'],
})
export class MovieFilterComponent implements OnInit {
  releaseTypesOptions = [
    { value: 1, label: 'Premiere' },
    { value: 2, label: 'Theatrical (limited)' },
    { value: 3, label: 'Theatrical' },
    { value: 4, label: 'Digital' },
    { value: 5, label: 'Physical' },
    { value: 6, label: 'TV' },
  ];
  sortByOptions: SelectOption[] = [
    {
      value: 'popularity.desc',
      label: 'Popularity Descending',
    },
    {
      value: 'popularity.asc',
      label: 'Popularity Ascending',
    },
    {
      value: 'vote_average.desc',
      label: 'Rating Descending',
    },
    {
      value: 'vote_average.asc',
      label: 'Rating Ascending',
    },
    {
      value: 'release_date.desc',
      label: 'Release Date Descending',
    },
    {
      value: 'release_date.asc',
      label: 'Release Date Ascending',
    },
  ];

  // Template-driven form properties
  sortBy: string = 'popularity.desc';
  categoryValue: string = 'popular';
  region: string = '';
  language: string = 'en';
  genres: any[] = [];
  releaseTypes: any[] = [1, 2, 3, 4, 5, 6];
  dateFrom: string = '';
  dateTo: string = '';
  isSearchAllReleases: boolean = true;
  isSearchAllCountries: boolean = false;
  selectedKeywords: number[] = [];

  movieGenres: ToggleSelectBox[] = [];
  countryOptions: SelectOption[] = [];
  languageOptions: SelectOption[] = [];

  @Input() filterObject = {};
  @Input() category = {};
  @Output() onClickFilter = new EventEmitter<any>();

  constructor(
    private genreService: GenreService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit() {
    this.loadGenres();
    this.loadCountries();
    this.loadLanguages();
  }

  // Method to handle filter button click
  onFilterClick() {
    let formData = {
      sort_by: this.sortBy,
      with_origin_country: this.region,
      with_original_language: this.language,
      with_genres: this.genres.join(','),
      with_release_type: this.releaseTypes,
      with_keywords: this.selectedKeywords.join(','),
      primary_release_date_gte: this.dateFrom,
      primary_release_date_lte: this.dateTo,
    };

    this.onClickFilter.emit(formData);
  }

  // Methods for handling custom component events
  onChangeSelectGenreList(selectedValues: ToggleSelectBox[]) {
    this.genres = selectedValues.map((item: any) => item.value);
  }

  onChangeSelectReleaseType(selectedValues: ToggleSelectBox[]) {
    this.releaseTypes = selectedValues.map((item: any) => item.value);
  }

  handleSelectCountry(value: string) {
    this.region = value;
  }

  // Method to handle isSearchAllReleases change
  onSearchAllReleasesChange() {
    if (this.isSearchAllReleases === false) {
      this.isSearchAllCountries = true;
    }
  }

  onKeywordsChange(keywords: number[]) {
    this.selectedKeywords = keywords;
  }

  loadGenres() {
    this.genreService.getMovieGenreList().subscribe({
      next: (res: GenreListResponse) => {
        this.movieGenres = res.genres.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      },
    });
  }

  loadCountries() {
    this.configurationService.getCountries().subscribe({
      next: (res: any) => {
        this.countryOptions = res.map((item: Country) => {
          return {
            value: item.iso_3166_1,
            label: item.english_name,
          };
        });
      },
    });
  }

  loadLanguages() {
    this.configurationService.getLanguages().subscribe({
      next: (res: any) => {
        this.languageOptions = res.map((item: Language) => {
          return {
            value: item.iso_639_1,
            label: item.english_name,
          };
        });
      },
    });
  }

  // Method to reset form
  resetForm() {
    this.sortBy = 'popularity.desc';
    this.categoryValue = 'popular';
    this.region = 'US';
    this.language = 'en';
    this.genres = [];
    this.releaseTypes = [1, 2, 3, 4, 5, 6];
    this.selectedKeywords = [];
    this.dateTo = '';
    this.isSearchAllReleases = true;
    this.isSearchAllCountries = false;
  }

  // Method to get form values
}
