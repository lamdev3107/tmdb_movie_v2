import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CountryService } from '@core/services/country.service';
import { Country } from '@core/models/country.model';
import { LanguageService } from '@core/services/languague.service';
import { Language } from '@core/models/language.model';
import { CompanyService } from '@core/services/company.service';
import { GenreService } from '@core/services/genre.service';
import { Company } from '@core/models/company.model';
import { Genre } from '@core/models/genre.model';
import { PeopleService } from '@features/admin/people/services/people.service';
import {
  AdminPerson,
  jobOptions,
} from '@features/admin/people/models/admin-person.model';
import { ToastService } from '@core/services/toast.service';
import { SelectOption } from '@shared/components/input-chip-list/input-chip-list.component';

interface MovieCast {
  id: number;
  name: string;
  character?: string;
  job: string;
}

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss'],
})
export class MovieFormComponent implements OnInit, OnChanges {
  @Input() movieData?: any;
  @Input() isEditMode: boolean = false;

  movieForm: FormGroup;
  castForm: FormGroup;
  isSubmitting = false;
  selectedPoster: File | null = null;
  selectedBackdrop: File | null = null;
  posterPreviewUrl: string | null = null;
  backdropPreviewUrl: string | null = null;
  countryid: string = '';
  countryOptions: SelectOption[] = [];
  languageOptions: SelectOption[] = [];
  companyOptions: SelectOption[] = [];
  genreOptions: SelectOption[] = [];
  personOptions: SelectOption[] = [];

  statusOptions = [
    { value: 'Released', label: 'Released' },
    { value: 'Post Production', label: 'Post Production' },
    { value: 'In Production', label: 'In Production' },
    { value: 'Planned', label: 'Planned' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  jobOptions = jobOptions;
  castArray: MovieCast[] = [];

  editingCastIndex: number | null = null;

  // Lắng nghe thay đổi của form và log ra movieForm.get('companyIds')
  ngAfterViewInit() {
    this.movieForm.valueChanges.subscribe(() => {
      console.log(this.movieForm.value);
    });
  }
  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private countryService: CountryService,
    private companyService: CompanyService,
    private genreService: GenreService,
    private peopleService: PeopleService,
    private languageService: LanguageService // // private companyService: CompanyService, // private genreService: GenreService
  ) {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      originalTitle: ['', [Validators.required]],
      overview: ['', [Validators.required, Validators.minLength(10)]],
      releaseDate: ['', [Validators.required]],
      runtime: [0, [Validators.required, Validators.min(1)]],
      voteAverage: [0, [Validators.min(0), Validators.max(100)]],
      voteCount: [0, [Validators.min(0)]],
      trailerUrl: ['', []],
      budget: [0, [Validators.min(0)]],
      revenue: [0, [Validators.min(0)]],
      tagline: [''],
      homepageUrl: [''],
      status: ['Released', [Validators.required]],
      poster: [null],
      backdrop: [null],
      countryIds: [[]],
      languageIds: [[]],
      companyIds: [[]],
      genreIds: [[]],
    });
    this.castForm = this.fb.group({
      person: [null, Validators.required],
      character: [''],
      job: [jobOptions[0].value, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    this.loadLanguages();
    this.loadCompanies();
    this.loadGenres();
    this.loadPersons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieData'] && this.movieData) {
      this.populateForm();
    }
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
  loadCompanies(page: number = 1, size: number = 30, keyword: string = '') {
    this.companyService.getCompanies(page, size, keyword).subscribe({
      next: (res: any) => {
        this.companyOptions = res.map((item: Company) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      },
    });
  }
  loadLanguages(page: number = 1, size: number = 30, keyword: string = '') {
    this.languageService.getLanguages(page, size, keyword).subscribe({
      next: (res: any) => {
        this.languageOptions = res.map((item: Language) => {
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
  loadPersons(page: number = 1, size: number = 30, keyword: string = '') {
    this.peopleService.getPeople(page, size, keyword).subscribe({
      next: (res: any) => {
        this.personOptions = res.results.map((item: AdminPerson) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      },
    });
  }

  handleQueryLanguageChange(query: string) {
    this.loadLanguages(1, 30, query);
  }
  handleQueryGenreChange(query: string) {
    this.loadGenres(1, 30, query);
  }
  handleQueryCompanyChange(query: string) {
    this.loadCompanies(1, 30, query);
  }
  handleQueryCountryChange(query: string) {
    this.loadCountries(1, 30, query);
  }
  handleQueryPersonChange(query: string) {
    this.loadPersons(1, 30, query);
  }

  addCastMember(): void {
    this.castArray.push({
      id: this.castForm.value.person.value,
      name: this.castForm.value.person.label,
      job: this.castForm.value.job,
      character: this.castForm.value.character,
    });
    this.castForm.reset();
  }

  isDisabledAddMember() {
    // console.log('Check form', this.castForm.value);
    return this.castForm.invalid;
  }

  cancelEditCastMember(): void {
    this.editingCastIndex = null;
    this.castForm.reset();
  }

  handleClickEditCastMember(index: number): void {
    this.editingCastIndex = index;
    console.log('Check index', this.editingCastIndex);
    console.log('Check castArray', this.castArray);
    this.castForm.setValue({
      person: {
        value: this.castArray[index].id,
        label: this.castArray[index].name,
      },
      job: this.castArray[index].job,
      character: this.castArray[index].character || '',
    });
  }

  editMember(): void {
    this.castArray[this.editingCastIndex!] = {
      id: this.castForm.value.person.value,
      name: this.castForm.value.person.label,
      job: this.castForm.value.job,
      character: this.castForm.value.character,
    };
    console.log('check edited', this.castArray[this.editingCastIndex!]);

    this.castForm.reset();
    this.editingCastIndex = null;
  }

  removeCastMember(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này không?')) {
      this.castArray.splice(index, 1);
    }
  }

  handleSelectCountry(value: string) {
    this.movieForm.patchValue({
      countryIds: [...this.movieForm.value.countryIds, value],
    });
  }

  onPosterSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPoster = file;
      this.movieForm.patchValue({ poster: file });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.posterPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onBackdropSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedBackdrop = file;
      this.movieForm.patchValue({ backdrop: file });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.backdropPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePoster(): void {
    this.selectedPoster = null;
    this.posterPreviewUrl = null;
    this.movieForm.patchValue({ poster: null });
  }

  removeBackdrop(): void {
    this.selectedBackdrop = null;
    this.backdropPreviewUrl = null;
    this.movieForm.patchValue({ backdrop: null });
  }

  populateForm(): void {
    if (this.movieData) {
      this.movieForm.patchValue({
        title: this.movieData.movie.title,
        originalTitle: this.movieData.movie.originalTitle,
        overview: this.movieData.movie.overview,
        releaseDate: this.movieData.movie.releaseDate,
        runtime: this.movieData.movie.runtime,
        voteAverage: this.movieData.movie.voteAverage,
        voteCount: this.movieData.movie.voteCount,
        trailerUrl: this.movieData.movie.trailerUrl,
        budget: this.movieData.movie.budget,
        revenue: this.movieData.movie.revenue,
        tagline: this.movieData.movie.tagline,
        homepageUrl: this.movieData.movie.homepageUrl,
        status: this.movieData.movie.status,
      });

      // Populate cast array
      if (this.movieData.casting && this.movieData.casting.length > 0) {
        this.castArray = [];

        const castData = this.movieData.casting.map((castMember: any) => {
          return {
            id: castMember.personDTO.id,
            name: castMember.personDTO.name,
            character: castMember.characterName,
            job: castMember.job,
          };
        });
        this.castArray.push(...castData);

        const crewData = this.movieData.crew.map((castMember: any) => {
          return {
            id: castMember.personDTO.id,
            name: castMember.personDTO.name,
            job: castMember.job,
          };
        });
        this.castArray.push(...crewData);
      }

      //Populate image
      this.posterPreviewUrl = this.movieData.movie.posterPath;
      this.backdropPreviewUrl = this.movieData.movie.backdropPath;

      //Populate countryIds
      this.movieForm.patchValue({
        countryIds: this.movieData.movie.countries.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      });
      //Populate languageIds
      this.movieForm.patchValue({
        languageIds: this.movieData.movie.languages.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      });
      //Populate companyIds
      this.movieForm.patchValue({
        companyIds: this.movieData.movie.companies.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      });
      //Populate genreIds
      this.movieForm.patchValue({
        genreIds: this.movieData.movie.genres.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      });
    }
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      // Kiểm tra giá trị của form
      this.isSubmitting = true;
      let formData = new FormData();
      formData.append('title', this.movieForm.value.title);
      formData.append('originalTitle', this.movieForm.value.originalTitle);
      formData.append('overview', this.movieForm.value.overview);
      formData.append('releaseDate', this.movieForm.value.releaseDate);
      formData.append('runtime', this.movieForm.value.runtime);
      formData.append('voteAverage', this.movieForm.value.voteAverage);
      formData.append('voteCount', this.movieForm.value.voteCount);
      formData.append('trailerUrl', this.movieForm.value.trailerUrl);
      formData.append('budget', this.movieForm.value.budget);
      formData.append('revenue', this.movieForm.value.revenue);
      formData.append('tagline', this.movieForm.value.tagline);
      formData.append('homepageUrl', this.movieForm.value.homepageUrl);
      formData.append('status', this.movieForm.value.status);
      if (this.movieForm.value.poster) {
        formData.append('poster', this.movieForm.value.poster);
      }
      if (this.movieForm.value.backdrop) {
        formData.append('backdrop', this.movieForm.value.backdrop);
      }
      formData.append(
        'countryIds',
        this.movieForm.value.countryIds.map((item: SelectOption) => item.value)
      );
      formData.append(
        'languageIds',
        this.movieForm.value.languageIds.map((item: SelectOption) => item.value)
      );
      formData.append(
        'companyIds',
        this.movieForm.value.companyIds.map((item: SelectOption) => item.value)
      );
      formData.append(
        'genreIds',
        this.movieForm.value.genreIds.map((item: SelectOption) => item.value)
      );
      const persons = this.castArray.map((item) => {
        return {
          personId: item.id,
          characterName: item.character,
          job: item.job,
        };
      });

      formData.append('persons', JSON.stringify(persons));
      // console.log('Check persons FormData:', formData.get('persons'));
      // return;
      if (this.isEditMode) {
        formData.append('id', this.movieData.movie.id);
        this.movieService.updateMovie(formData).subscribe({
          next: (response) => {
            this.toastService.success('Cập nhật phim thành công!');
            this.router.navigate(['/admin/movies']);
          },
          error: (error) => {
            console.error('Error updating movie:', error);
            this.isSubmitting = false;
          },
        });
      } else {
        this.movieService.createMovie(formData).subscribe({
          next: (response) => {
            this.toastService.success('Tạo phim thành công!');
            this.router.navigate(['/admin/movies']);
          },
          error: (error) => {
            console.error('Error creating movie:', error);
            this.isSubmitting = false;
          },
        });
      }
    } else {
      this.markFormGroupTouched();
      this.toastService.error('Vui lòng kiểm tra lại thông tin!');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.movieForm.controls).forEach((key) => {
      const control = this.movieForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach((ctrl) => {
          if (ctrl instanceof FormGroup) {
            Object.keys(ctrl.controls).forEach((ctrlKey) => {
              ctrl.get(ctrlKey)?.markAsTouched();
            });
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.movieForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Trường này là bắt buộc';
      }
      if (control.errors['minlength']) {
        return `Tối thiểu ${control.errors['minlength'].requiredLength} ký tự`;
      }
      if (control.errors['min']) {
        return `Giá trị tối thiểu là ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `Giá trị tối đa là ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  // getCastErrorMessage(index: number, controlName: string): string {
  //   const castControl = this.castArray.at(index).get(controlName);
  //   if (castControl?.errors && castControl.touched) {
  //     if (castControl.errors['required']) {
  //       return 'Trường này là bắt buộc';
  //     }
  //   }
  //   return '';
  // }
}
