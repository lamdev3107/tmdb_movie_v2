import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '@core/models/account.model';
import { AccountService } from '@core/services/account.service';
import { map, Observable, startWith } from 'rxjs';
export interface ApiState<T> {
  loading: boolean;
  data: T;
}
@Component({
  selector: 'app-account-layout',
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.scss'],
})
export class AccountLayoutComponent implements OnInit {
  accountDetails$!: Observable<ApiState<Account>>;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.accountDetails$ = this.accountService.getAccountDetails().pipe(
      startWith({ loading: true } as ApiState<Account>),
      map(
        (data) =>
          ({
            loading: false,
            data,
          } as ApiState<Account>)
      )
    );
  }
}
