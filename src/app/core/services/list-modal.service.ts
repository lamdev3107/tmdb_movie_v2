import { Injectable } from '@angular/core';
import { ListFilm } from '@features/client/account/services/list-films.service';
import { BehaviorSubject } from 'rxjs';

export interface ListModalConfig {
  list?: ListFilm;
  onClose?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ListModalService {
  private _isOpen = new BehaviorSubject<boolean>(false);
  private _config = new BehaviorSubject<ListModalConfig | null>(null);

  isOpen$ = this._isOpen.asObservable();
  config$ = this._config.asObservable();

  open(config: ListModalConfig) {
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
