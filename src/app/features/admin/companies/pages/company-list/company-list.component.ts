import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company, CompanyResponseData } from '@core/models/company.model';
import { CompanyService } from '@core/services/company.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  companies: Company[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  loading = false;
  editingCompany: Company | null = null;
  companyForm: FormGroup;
  isSubmitting = false;

  constructor(
    private companyService: CompanyService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      logo: ['', []],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(
    page: number = 1,
    size: number = 8,
    keyword: string = ''
  ): void {
    this.loading = true;
    this.companyService.getCompanies(page, size, keyword).subscribe({
      next: (response: any) => {
        const { metaInfo, results } = response;
        this.companies = results;
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
    this.loadCompanies(this.currentPage, 8);
  }

  deleteCompany(id: number): void {
    if (confirm(`Bạn có chắc chắn muốn xóa công ty có id là ${id}?`)) {
      this.companyService.deleteCompany(id).subscribe({
        next: () => {
          this.loadCompanies();
          this.toastService.success('Xóa công ty thành công!');
        },
      });
    }
  }

  handleClickEditBtn(company: Company): void {
    console.log('Chekc company', company);
    this.editingCompany = company;
    this.populateForm();
    // this.router.navigate(['/admin/people/edit', id]);
  }

  handleClickCancelBtn(): void {
    this.editingCompany = null;
    this.companyForm.reset();
    this.previewUrl = null;
  }

  populateForm(): void {
    if (this.editingCompany) {
      this.companyForm.patchValue({
        name: this.editingCompany.name,
      });
      this.previewUrl = this.editingCompany.logoPath;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.companyForm.controls).forEach((key) => {
      const control = this.companyForm.get(key);
      control?.markAsTouched();
    });
  }

  onSubmit(): void {
    // return;
    if (this.companyForm.valid) {
      this.isSubmitting = true;
      const bodyPayload = new FormData();
      bodyPayload.append('name', this.companyForm.value.name);
      if (this.companyForm.value.logo) {
        bodyPayload.append('logo', this.companyForm.value.logo);
      }
      // for (const pair of (bodyPayload as any).entries()) {
      //   console.log('bodyPayload:', pair[0], pair[1]);
      // }
      // return;
      if (this.editingCompany) {
        bodyPayload.append('id', this.editingCompany.id.toString());
        this.companyService.updateCompany(bodyPayload).subscribe({
          next: (response) => {
            this.toastService.success('Cập nhật thể loại thành công!');
            this.companyForm.reset();
            this.previewUrl = null;
            this.loadCompanies();
            this.isSubmitting = false;
            this.editingCompany = null;
          },
          error: (error) => {
            console.error('Error updating person:', error);
            this.isSubmitting = false;
          },
        });
      } else {
        this.companyService.createCompany(bodyPayload).subscribe({
          next: (response) => {
            this.toastService.success('Thêm thể loại thành công!');
            this.loadCompanies();
            this.previewUrl = null;
            this.companyForm.reset();
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.companyForm.patchValue({
        logo: file,
      });

      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.companyForm.patchValue({
      logo: null,
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.companyForm.get(controlName);
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
  trackByCompanyId(index: number, company: Company): number {
    return company.id;
  }
}
