import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    const alertPopup = confirm('Vui lòng đăng nhập để truy cập trang này!');
    if (alertPopup) {
      this.router.navigate(['/login']);
    }
    return false;
  }
  /**
   * Giải thích các hàm của guard:
   *
   * - canActivate(): boolean
   *   Hàm này được gọi khi người dùng cố gắng truy cập vào route có gắn guard này.
   *   + Nếu người dùng đã đăng nhập (authService.isAuthenticated() trả về true), cho phép truy cập (return true).
   *   + Nếu chưa đăng nhập, hiển thị popup yêu cầu đăng nhập. Nếu người dùng đồng ý, chuyển hướng sang trang đăng nhập ('/login').
   *   + Trả về false để chặn truy cập vào route.
   *
   * Ngoài canActivate, Angular còn hỗ trợ các hàm guard khác như:
   *
   * - canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
   *   Được sử dụng để bảo vệ các route con (child routes).
   *
   * - canDeactivate(component: T, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
   *   Được sử dụng để xác nhận trước khi rời khỏi component hiện tại (ví dụ: cảnh báo khi có dữ liệu chưa lưu).
   *
   * - canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
   *   Được sử dụng để kiểm tra trước khi load một module (Lazy loading).
   *
   * - canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
   *   Được sử dụng để xác định xem route có phù hợp để kích hoạt hay không (Angular 15+).
   */
}
