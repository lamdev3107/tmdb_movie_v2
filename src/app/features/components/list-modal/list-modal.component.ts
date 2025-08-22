import { ListFilmsService } from './../../client/account/services/list-films.service';
import { AuthService } from '@core/services/auth.service';
import { Component, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  RatingModalConfig,
  RatingModalService,
} from '@core/services/rating-modal.service';
import { MovieService } from '@features/client/movies/services/movie.service';
import { ToastService } from '@core/services/toast.service';
import {
  ListModalConfig,
  ListModalService,
} from '@core/services/list-modal.service';
import { SelectOption } from '@shared/components/input-search/input-search.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss'],
})
export class ListModalComponent implements OnInit {
  credential: any | null = null;
  config: RatingModalConfig | null = null;
  isOpen = false;
  listFilms: SelectOption[] = [];
  addToListForm: FormGroup;
  listAction: string = 'select';
  constructor(
    private modalService: RatingModalService,
    private authService: AuthService,
    private listModalService: ListModalService,
    private toastService: ToastService,
    private movieService: MovieService,
    private fb: FormBuilder,
    private listFilmService: ListFilmsService
  ) {
    this.addToListForm = this.fb.group({
      listName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.credential = this.authService.getCredential();
    this.listModalService.isOpen$.subscribe((open) => (this.isOpen = open));
    this.listModalService.config$.subscribe((cfg) => {
      this.config = cfg;
      this.addToListForm.patchValue({
        listName: this.config?.movie?.id,
      });
      this.loadList();
    });
  }

  loadList() {
    this.listFilmService.getListFilmsOfUser(this.credential.id).subscribe({
      next: (res) => {
        this.listFilms = res.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
      error: (err) => {
        this.listFilms = [];
        // this.toastService.error('Error loading list');
      },
    });
  }
  addMovieToList() {
    console.log('Add movie to list', this.addToListForm.value);
    this.listFilmService
      .addMovieToList(
        Number(this.addToListForm.value.listName.value),
        Number(this.config?.movie?.id)
      )
      .subscribe({
        next: (res) => {
          console.log('Add movie to list success', res);
          this.toastService.success('Add movie to list success');
          this.close();
        },
        error: (err) => {
          console.log('Add movie to list error', err);
        },
      });
  }
  handleQueryListChange(event: any) {
    console.log('Check this.', event);
  }
  close() {
    this.listModalService.close();
    this.config?.onClose?.();
  }
}
