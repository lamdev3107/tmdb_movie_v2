import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Language, LanguageResponseData } from '@core/models/language.model';
import { LanguageService } from '@core/services/languague.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
})
export class LanguageListComponent implements OnInit {
  languages: Language[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  loading = false;
  editingLanguage: Language | null = null;

  languageForm: FormGroup;
  isSubmitting = false;

  searchQuery = '';
  private debounceTimeout: any;

  constructor(
    private languageService: LanguageService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.languageForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      languageCode: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.loadLanguages();
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
      this.loadLanguages(1, 8, this.searchQuery);
    }, 500);
  }

  loadLanguages(
    page: number = 1,
    size: number = 8,
    keyword: string = ''
  ): void {
    this.loading = true;
    this.languageService.getLanguages(page, size, keyword).subscribe({
      next: (response: LanguageResponseData) => {
        const { metaInfo, results } = response;
        this.languages = results;
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
    this.loadLanguages(this.currentPage, 8);
  }

  deleteLanguage(id: number): void {
    if (confirm(`Bạn có chắc chắn muốn xóa thể loại có id là ${id}?`)) {
      this.languageService.deleteLanguage(id).subscribe({
        next: () => {
          this.loadLanguages();
        },
      });
    }
    this.toastService.success('Xóa thể loại thành công!');
  }

  handleClickEditBtn(genre: Language): void {
    this.editingLanguage = genre;
    this.populateForm();
    // this.router.navigate(['/admin/people/edit', id]);
  }

  handleClickCancelBtn(): void {
    this.editingLanguage = null;
    this.languageForm.reset();
  }

  populateForm(): void {
    if (this.editingLanguage) {
      this.languageForm.patchValue({
        name: this.editingLanguage.name,
        languageCode: this.editingLanguage.languageCode,
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.languageForm.controls).forEach((key) => {
      const control = this.languageForm.get(key);
      control?.markAsTouched();
    });
  }

  onSubmit(): void {
    if (this.languageForm.valid) {
      this.isSubmitting = true;
      const bodyPayload = JSON.stringify(this.languageForm.value);
      if (this.editingLanguage) {
        // Bổ sung key id vào bodyPayload
        const updatedPayload = {
          ...this.languageForm.value,
          id: this.editingLanguage.id,
        };
        const bodyPayloadWithId = JSON.stringify(updatedPayload);
        this.languageService.updateLanguage(bodyPayloadWithId).subscribe({
          next: (response) => {
            this.toastService.success('Cập nhật ngôn ngữ thành công!');
            this.languageForm.reset();
            this.loadLanguages();
            this.isSubmitting = false;
            this.editingLanguage = null;
          },
          error: (error) => {
            console.error('Error updating person:', error);
            this.isSubmitting = false;
          },
        });
      } else {
        this.languageService.createLanguage(bodyPayload).subscribe({
          next: (response) => {
            this.toastService.success('Thêm ngôn ngữ thành công!');
            this.loadLanguages();
            this.languageForm.reset();
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
    const control = this.languageForm.get(controlName);
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
  trackByLanguageId(index: number, genre: Language): number {
    return genre.id;
  }
}
