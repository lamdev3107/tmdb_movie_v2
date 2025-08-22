import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { ListFilm, ListFilmsService } from '../../services/list-films.service';

@Component({
  selector: 'app-list-form-modal',
  templateUrl: './list-form-modal.component.html',
  styleUrls: ['./list-form-modal.component.scss'],
})
export class ListFormModalComponent implements OnInit, OnChanges {
  listForm: FormGroup;
  credential: any | null = null;
  @Input() isOpen: boolean = false;
  @Input() data: ListFilm | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() reloadList = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private listFilmService: ListFilmsService,
    private authService: AuthService
  ) {
    this.listForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.credential = this.authService.getCredential();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.populateForm();
    }
  }

  close() {
    this.listForm.reset();
    this.data = null;
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.data) {
      this.updateList();
    } else {
      this.createList();
    }
  }

  createList() {
    this.markFormGroupTouched();
    if (this.listForm.invalid) {
      return;
    }
    const body = {
      name: this.listForm.value.name,
      description: this.listForm.value.description,
      isPublic: true,
      userId: this.credential.id,
    };
    this.listFilmService.createListFilm(body).subscribe({
      next: (res) => {
        this.reloadList.emit();
        this.closeModal.emit();
      },
      error: (err) => {
        console.log('Create list error', err);
      },
    });
  }

  updateList() {
    this.markFormGroupTouched();
    if (this.listForm.invalid) {
      return;
    }
    const body = {
      name: this.listForm.value.name,
      description: this.listForm.value.description,
      userId: this.credential.id,
      isPublic: true,
    };
    this.listFilmService.updateListFilm(Number(this.data?.id), body).subscribe({
      next: (res) => {
        this.reloadList.emit();
        this.closeModal.emit();
      },
      error: (err) => {
        console.log('Update list error', err);
      },
    });
  }

  populateForm() {
    if (this.data) {
      this.listForm.patchValue({
        name: this.data.name,
        description: this.data.description,
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.listForm.get(controlName);
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
  private markFormGroupTouched(): void {
    Object.keys(this.listForm.controls).forEach((key) => {
      const control = this.listForm.get(key);
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
}
