import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { Observable } from 'rxjs';
import { header_navigation } from 'src/app/core/utils/constants';
import { AccountService } from '@core/services/account.service';
import { Account } from '@core/models/account.model';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('userMenuContainer') userMenuContainer!: ElementRef;
  accountDetails$!: Observable<Account>;
  credential: any | null = null;

  headerNavigation = header_navigation;
  isHeaderVisible = true;
  isSearchVisible = false;

  isOpenUserMenu = false;
  isUserMenuOpen = false;
  isOpenHamburgerMenu = false;
  private lastScrollTop = 0;
  private scrollThreshold = 10;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.accountDetails$ = this.accountService.getAccountDetails();
    // this.credential = this.authService.getCredential();
    this.authService.credential$.subscribe((credential) => {
      // Khi load trang, nếu credential là null thì lấy từ localStorage và cập nhật lại cho credentialSubject
      if (credential === null) {
        const storedCredential = this.authService.getCredential();
        if (storedCredential && Object.keys(storedCredential).length > 0) {
          this.authService.setCredential(storedCredential);
          this.credential = storedCredential;
        } else {
          this.credential = null;
        }
      } else {
        this.credential = credential;
      }
    });
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onClickOpenMenuBurger() {
    this.isOpenHamburgerMenu = true;
  }

  onClickCloseMenuBurger() {
    this.isOpenHamburgerMenu = false;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  onClickLogout() {
    this.authService.logout().subscribe((res) => {});
    this.router.navigate(['/auth/login']);
    this.authService.clearToken();
    this.authService.clearCredential();
    this.isUserMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.userMenuContainer &&
      !this.userMenuContainer.nativeElement.contains(event.target as Node)
    ) {
      this.isUserMenuOpen = false;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > this.scrollThreshold) {
      this.isHeaderVisible = currentScrollTop < this.lastScrollTop;
      this.isSearchVisible = false;
      this.isUserMenuOpen = false;
    } else {
      this.isHeaderVisible = true;
    }
    this.lastScrollTop = currentScrollTop;
  }
}
