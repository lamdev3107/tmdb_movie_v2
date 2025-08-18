import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  currentRoute = '';
  credential: any | null = null;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
    this.credential = this.authService.getCredential();
  }

  logout(): void {
    this.authService.logout().subscribe((res) => {});
    this.router.navigate(['/auth/login']);
    this.authService.clearToken();
    this.authService.clearCredential();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  getPageTitle(): string {
    if (this.currentRoute.includes('/people')) {
      return 'Celebirty Management';
    } else if (this.currentRoute.includes('/movies')) {
      return 'Movie Management';
    } else if (this.currentRoute.includes('/genres')) {
      return 'Genre Management';
    } else if (this.currentRoute.includes('/settings')) {
      return 'Settings';
    }
    return 'Dashboard';
  }
}
