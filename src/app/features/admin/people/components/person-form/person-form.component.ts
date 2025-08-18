import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminPerson, jobOptions } from '../../models/admin-person.model';
import { PeopleService } from '../../services/people.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
})
export class PersonFormComponent implements OnInit, OnChanges {
  @Input() personData?: AdminPerson;
  @Input() isEditMode: boolean = false;

  personForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  jobOptions = jobOptions;

  genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Others' },
  ];

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private router: Router
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      career: ['', [Validators.required]],
      biography: ['', [Validators.required, Validators.minLength(10)]],
      birthDate: ['', [Validators.required]],
      placeOfBirth: ['', [Validators.required]],
      deathDate: [''],
      gender: ['MALE', [Validators.required]],
      profile: [null, []],
      profilePath: [''],
      profilePublicId: [''],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personData'] && this.personData) {
      this.populateForm();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.personForm.patchValue({
        profile: file,
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
    this.personForm.patchValue({
      profile: null,
    });
  }

  populateForm(): void {
    if (this.personData) {
      this.personForm.patchValue({
        name: this.personData.name,
        career: this.personData.career,
        biography: this.personData.biography,
        birthDate: this.personData.birthDate,
        placeOfBirth: this.personData.placeOfBirth,
        deathDate: this.personData.deathDate,
        gender: this.personData.gender,
        profilePath: this.personData.profilePath,
        profilePublicId: this.personData.profilePublicId,
      });

      // Nếu có ảnh profile, hiển thị preview
      if (this.personData.profilePath) {
        this.previewUrl = this.personData.profilePath;
      }
    }
  }

  onSubmit(): void {
    console.log('check this.person', this.personForm.value);
    // return;
    if (this.personForm.valid) {
      this.isSubmitting = true;

      const personData: AdminPerson = {
        id: this.isEditMode ? this.personData?.id || 0 : 0,
        ...this.personForm.value,
      };
      let formData = new FormData();
      Object.entries(this.personForm.value).forEach(([key, value]) => {
        // Nếu là file (profilePath) và có selectedFile thì append file, nếu không thì append giá trị thường
        if (key === 'profilePath' && this.selectedFile) {
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });
      // Log qua các key value của formData
      // for (const pair of (formData as any).entries()) {
      //   console.log('formData:', pair[0], pair[1]);
      // }

      if (this.isEditMode) {
        formData.append('id', personData.id.toString());
        this.peopleService.updatePerson(personData.id, formData).subscribe({
          next: (response) => {
            console.log('Person updated successfully:', response);
            this.router.navigate(['/admin/people']);
          },
          error: (error) => {
            console.error('Error updating person:', error);
            this.isSubmitting = false;
          },
        });
      } else {
        this.peopleService.createPerson(formData).subscribe({
          next: (response) => {
            console.log('Person created successfully:', response);
            this.router.navigate(['/admin/people']);
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

  private markFormGroupTouched(): void {
    Object.keys(this.personForm.controls).forEach((key) => {
      const control = this.personForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.personForm.get(controlName);
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
}
