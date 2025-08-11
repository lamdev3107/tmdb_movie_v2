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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('userMenuContainer') userMenuContainer!: ElementRef;
  accountDetails$!: Observable<Account>;
  headerNavigation = header_navigation;
  isHeaderVisible = true;
  isSearchVisible = false;

  isOpenUserMenu = false;
  isUserMenuOpen = false;
  isOpenHamburgerMenu = false;
  private lastScrollTop = 0;
  private scrollThreshold = 10;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountDetails$ = this.accountService.getAccountDetails();
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
