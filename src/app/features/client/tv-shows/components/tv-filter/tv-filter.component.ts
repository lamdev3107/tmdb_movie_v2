import {
  ConfigurationService,
  Language,
} from '../../../../../core/services/configuration.service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { GenreListResponse } from '@core/models/genre.model';
import { GenreService } from '@core/services/genre.service';
import { TVShowService } from '@features/client/services/tv-shows.service';
import { RadioOption } from '@shared/components/input-radio-group/input-radio-group.component';
import { SelectOption } from '@shared/components/select/select.component';
import { ToggleSelectBox } from '@shared/components/toggle-select-box-list/toggle-select-box-list.component';

@Component({
  selector: 'app-tv-filter',
  templateUrl: './tv-filter.component.html',
  styleUrls: ['./tv-filter.component.scss'],
})
export class TVFilterComponent implements OnInit {
  categoryOptions: RadioOption[] = [
    { value: 'popular', label: 'Popular' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'now_playing', label: 'Now Playing' },
  ];
  releaseTypes = [
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
      value: 'first_air_date.desc',
      label: 'First Air Date Descending',
    },
    {
      value: 'first_air.asc',
      label: 'First Air Date Ascending',
    },
  ];
  sortBy?: string = 'popularity.desc';
  tvShowGenres: ToggleSelectBox[] = [];
  categoryValue: string = 'popular';
  language: string = 'en';
  genres: any[] = [];

  selectedGenres: ToggleSelectBox[] = [];
  selectedReleaseType: [] = [];
  isSearchAllEpisodes: boolean = true;
  isSearchFirstAirDate: boolean = true;
  selectedKeywords: number[] = [];
  dateFrom: string = '';
  dateTo: string = '';

  languageOptions: SelectOption[] = [];

  @Input() filterObject = {};
  @Input() category = {};
  @Output() onClickFilter = new EventEmitter<any>();

  constructor(
    private tvShowService: TVShowService,
    private genreService: GenreService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit() {
    this.loadGenres();
    this.loadLanguages();
  }

  // Method to handle filter button click
  onFilterClick() {
    let formData = {
      sort_by: this.sortBy,
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

  // Method to handle isSearchAllReleases change
  onSearchAllReleasesChange() {
    if (this.isSearchAllEpisodes === false) {
      this.isSearchFirstAirDate = true;
    }
  }

  onKeywordsChange(keywords: number[]) {
    this.selectedKeywords = keywords;
  }

  loadGenres() {
    this.genreService.getTVGenreList().subscribe({
      next: (res: GenreListResponse) => {
        this.tvShowGenres = res.genres.map((item) => {
          return {
            value: item.id,
            label: item.name,
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
}
