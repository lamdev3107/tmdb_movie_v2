import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '@core/models/country.model';
import { Genre } from '@core/models/genre.model';
import { Language, LanguageResponseData } from '@core/models/language.model';
import { CountryService } from '@core/services/country.service';
import { GenreService } from '@core/services/genre.service';
import { LanguageService } from '@core/services/languague.service';
import { ToastService } from '@core/services/toast.service';
import { RangeValue } from '@shared/components/input-range/input-range.component';
import { SelectOption } from '@shared/components/select/select.component';
import { ToggleSelectBox } from '@shared/components/toggle-select-box-list/toggle-select-box-list.component';

@Component({
  selector: 'app-movie-filter',
  templateUrl: './movie-filter.component.html',
  styleUrls: ['./movie-filter.component.scss'],
})
export class MovieFilterComponent implements OnInit {
  sortByOptions: SelectOption[] = [
    {
      value: 'releaseDate.desc',
      label: 'Release Date Descending',
    },
    {
      value: 'releaseDate.asc',
      label: 'Release Date Ascending',
    },
    {
      value: 'title.desc',
      label: 'Title Descending',
    },
    {
      value: 'title.asc',
      label: 'Title Ascending',
    },
    {
      value: 'voteaverage.desc',
      label: 'Rating Descending',
    },
    {
      value: 'voteaverage.asc',
      label: 'Rating Ascending',
    },
  ];

  movieForm: FormGroup;

  dateFrom: string = '';
  dateTo: string = '';
  isSearchAllReleases: boolean = true;
  isSearchAllCountries: boolean = false;
  selectedKeywords: number[] = [];

  countryOptions: SelectOption[] = [];
  languageOptions: SelectOption[] = [];
  genreOptions: SelectOption[] = [];

  @Input() filterObject = {};
  @Input() category = {};
  @Output() onClickFilter = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private genreService: GenreService,
    private languageService: LanguageService,
    private countryService: CountryService,
    private toastService: ToastService
  ) {
    this.movieForm = this.fb.group({
      isSearchAllCountries: [true],
      title: ['', []],
      sortBy: ['releaseDate.desc', []],
      countryIds: [[]],
      languageIds: [[]],
      genreIds: [[]],
      fromReleaseDate: [],
      toReleaseDate: [],
      runtimeRange: [{ min: 0, max: 360 }],
      ratingRange: [{ min: 0, max: 100 }],
    });
  }

  ngOnInit() {
    this.loadGenres();
    this.loadCountries();
    this.loadLanguages();
    this.movieForm
      .get('isSearchAllCountries')
      ?.valueChanges.subscribe((value: boolean) => {
        if (value) {
          this.movieForm.get('countryIds')?.setValue([]);
        }
      });
  }

  onSubmit(): void {
    let filterObject = {};

    // Kiểm tra các trường invalid
    if (this.movieForm.invalid) {
      this.movieForm.markAllAsTouched();
      // Log ra các trường invalid
      const invalidControls = Object.keys(this.movieForm.controls).filter(
        (key) => this.movieForm.get(key)?.invalid
      );
      console.log('Các trường invalid:', invalidControls);
      // Hiển thị thông báo lỗi hoặc dừng submit
      return;
    }
    // Kiểm tra giá trị của form

    const sortBy = this.movieForm.value.sortBy.split('.');
    const sortDirection = sortBy[1];
    const sortField = sortBy[0];
    // Thêm các trường trên vào filterObject
    filterObject = {
      title: this.movieForm.value.title,
      sortBy: sortField,
      sortDirection: sortDirection,
      countryIds: this.movieForm.value.countryIds
        .map((item: SelectOption) => item.value)
        .join(','),
      languageIds: this.movieForm.value.languageIds
        .map((item: SelectOption) => item.value)
        .join(','),
      genreIds: this.movieForm.value.genreIds
        .map((item: SelectOption) => item.value)
        .join(','),
      fromReleaseDate: this.movieForm.value.fromReleaseDate,
      toReleaseDate: this.movieForm.value.toReleaseDate,
      minRuntime: this.movieForm.value.runtimeRange.min,
      maxRuntime: this.movieForm.value.runtimeRange.max,
      minVoteAverage: this.movieForm.value.ratingRange.min,
      maxVoteAverage: this.movieForm.value.ratingRange.max,
    };
    this.onClickFilter.emit(filterObject);
  }

  onRatingRangeChange(value: RangeValue) {
    // console.log('Range changed:', value);
  }
  onRuntimeRangeChange(value: RangeValue) {
    // console.log('Range changed:', value);
  }
  handleQueryLanguageChange(query: string) {
    this.loadLanguages(1, 30, query);
  }
  handleQueryGenreChange(query: string) {
    this.loadGenres(1, 30, query);
  }
  handleQueryCountryChange(query: string) {
    this.loadCountries(1, 30, query);
  }

  loadLanguages(page: number = 1, size: number = 30, keyword: string = '') {
    this.languageService.getLanguages(page, size, keyword).subscribe({
      next: (res: LanguageResponseData) => {
        const languages = res.results;

        this.languageOptions = languages.map((item: Language) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      },
    });
  }
  loadCountries(page: number = 1, size: number = 30, keyword: string = '') {
    this.countryService.getCountries(page, size, keyword).subscribe({
      next: (res: any) => {
        this.countryOptions = res.map((item: Country) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      },
    });
  }
  loadGenres(page: number = 1, size: number = 30, keyword: string = '') {
    this.genreService.getGenres(page, size, keyword).subscribe({
      next: (res: any) => {
        this.genreOptions = res.results.map((item: Genre) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      },
    });
  }

  onClear() {
    this.movieForm.reset({
      isSearchAllCountries: false,
      title: "['', []]",
      sortBy: 'releaseDate.desc',
      countryIds: [],
      languageIds: [],
      genreIds: [],
      fromReleaseDate: [],
      toReleaseDate: [],
      runtimeRange: { min: 0, max: 360 },
      ratingRange: { min: 0, max: 100 },
    });
    this.onClickFilter.emit({});
  }

  // Method to reset form
  // resetForm() {
  //   this.sortBy = 'popularity.desc';
  //   this.categoryValue = 'popular';
  //   this.region = 'US';
  //   this.language = 'en';
  //   this.genres = [];
  //   this.releaseTypes = [1, 2, 3, 4, 5, 6];
  //   this.selectedKeywords = [];
  //   this.dateTo = '';
  //   this.isSearchAllReleases = true;
  //   this.isSearchAllCountries = false;
  // }

  // Method to get form values
}
