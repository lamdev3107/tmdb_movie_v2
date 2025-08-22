import { Injectable } from '@angular/core';
import { Movie } from '@features/client/movies/models/movie.model';
import { BehaviorSubject } from 'rxjs';

export interface RatingModalConfig {
  movie?: Movie;
  onClose?: () => void;
}

@Injectable({ providedIn: 'root' })
export class RatingModalService {
  private _isOpen = new BehaviorSubject<boolean>(false);
  private _config = new BehaviorSubject<RatingModalConfig | null>(null);

  isOpen$ = this._isOpen.asObservable();
  config$ = this._config.asObservable();

  open(config: RatingModalConfig) {
    this._config.next(config);
    this._isOpen.next(true);
  }

  close() {
    const currentConfig = this._config.getValue();

    this._isOpen.next(false);
    this._config.next(null);
    if (currentConfig?.onClose) {
      currentConfig.onClose();
    }
  }
}
