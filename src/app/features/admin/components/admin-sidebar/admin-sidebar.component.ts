import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent implements OnInit {
  credential: any | null = null;
  menuItems = [
    {
      label: 'Celebriy Management',
      icon: 'people',
      route: '/admin/people',
      active: false,
    },
    {
      label: 'Film Management',
      icon: 'movie',
      route: '/admin/movies',
      active: false,
    },
    {
      label: 'Genre Management',
      icon: 'category',
      route: '/admin/genres',
      active: false,
    },
    {
      label: 'Company Management',
      icon: 'work',
      route: '/admin/companies',
      active: false,
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/admin/settings',
      active: false,
    },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateActiveRoute();
    this.credential = this.authService.getCredential();
    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveRoute();
      });
  }

  updateActiveRoute(): void {
    const currentUrl = this.router.url;

    this.menuItems.forEach((item) => {
      if (
        currentUrl === item.route ||
        currentUrl.startsWith(item.route + '/')
      ) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  }

  setActiveItem(index: number): void {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
  }
}
