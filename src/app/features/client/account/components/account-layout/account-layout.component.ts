import { AuthService } from '@core/services/auth.service';
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
  credential: any | null = null;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.credential = this.authService.getCredential();
    this.accountDetails$ = this.accountService
      .getAccountDetails(this.credential.id)
      .pipe(
        startWith({ loading: true } as ApiState<Account>),
        map((data) => {
          return {
            loading: false,
            data,
          } as ApiState<Account>;
        })
      );
  }
}
