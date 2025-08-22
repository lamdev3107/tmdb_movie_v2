import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Genre, GenreResponseData } from '@core/models/genre.model';
import { GenreService } from '@core/services/genre.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss'],
})
export class GenreListComponent implements OnInit {
  genres: Genre[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  loading = false;
  editingGenre: Genre | null = null;

  genreForm: FormGroup;
  isSubmitting = false;

  searchQuery = '';
  private debounceTimeout: any;

  constructor(
    private genreService: GenreService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.genreForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.loadGenres();
  }

  clearQuery(): void {
    this.searchQuery = '';
    this.onSearchQueryChange('');
  }

  onSearchQueryChange(keyword: string): void {
    // Sử dụng debounce 500ms thì mới gọi loadPeople
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.searchQuery = keyword;
    this.debounceTimeout = setTimeout(() => {
      this.loadGenres(1, 8, this.searchQuery);
    }, 500);
  }

  loadGenres(page: number = 1, size: number = 8, keyword: string = ''): void {
    this.loading = true;
    this.genreService.getGenres(page, size, keyword).subscribe({
      next: (response: GenreResponseData) => {
        const { metaInfo, results } = response;
        this.genres = results;
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

  onPageChange(page: number): void {
    this.currentPage = page++;
    this.loadGenres(this.currentPage, 8);
  }

  deleteGenre(id: number): void {
    if (confirm(`Bạn có chắc chắn muốn xóa thể loại có id là ${id}?`)) {
      this.genreService.deleteGenre(id).subscribe({
        next: () => {
          this.loadGenres();
        },
      });
    }
    this.toastService.success('Xóa thể loại thành công!');
  }

  handleClickEditBtn(genre: Genre): void {
    this.editingGenre = genre;
    this.populateForm();
    // this.router.navigate(['/admin/people/edit', id]);
  }

  handleClickCancelBtn(): void {
    this.editingGenre = null;
    this.genreForm.reset();
  }

  populateForm(): void {
    if (this.editingGenre) {
      this.genreForm.patchValue({
        name: this.editingGenre.name,
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.genreForm.controls).forEach((key) => {
      const control = this.genreForm.get(key);
      control?.markAsTouched();
    });
  }

  onSubmit(): void {
    console.log('check this.person', this.genreForm.value);
    // return;
    if (this.genreForm.valid) {
      this.isSubmitting = true;
      const bodyPayload = JSON.stringify(this.genreForm.value);
      if (this.editingGenre) {
        // Bổ sung key id vào bodyPayload
        const updatedPayload = {
          ...this.genreForm.value,
          id: this.editingGenre.id,
        };
        const bodyPayloadWithId = JSON.stringify(updatedPayload);
        this.genreService.updateGenre(bodyPayloadWithId).subscribe({
          next: (response) => {
            this.toastService.success('Cập nhật thể loại thành công!');
            this.genreForm.reset();
            this.loadGenres();
            this.isSubmitting = false;
            this.editingGenre = null;
          },
          error: (error) => {
            console.error('Error updating person:', error);
            this.isSubmitting = false;
          },
        });
      } else {
        this.genreService.createGenre(bodyPayload).subscribe({
          next: (response) => {
            this.toastService.success('Thêm thể loại thành công!');
            this.loadGenres();
            this.genreForm.reset();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error creating person:', error);
            this.isSubmitting = false;
          },
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.genreForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Trường này là bắt buộc';
      }
      if (control.errors['minlength']) {
        return `Tối thiểu ${control.errors['minlength'].requiredLength} ký tự`;
      }
    }
    return '';
  }
  trackByGenreId(index: number, genre: Genre): number {
    return genre.id;
  }
}
