import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastService } from '@core/services/toast.service';

export const DEFAULT_TIMEOUT = 30000;

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private router: Router,
    private toastService: ToastService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiUrl = environment.apiUrl + req.url;

    const clonedRequest = req.clone({
      url: apiUrl,
      setHeaders: {
        Authorization: `Bearer ${environment.apiKey}`,
      },
    });

    return next.handle(clonedRequest).pipe(
      timeout(DEFAULT_TIMEOUT),
      tap({
        next: (event) => {
          // console.log('✅ Response received');
        },
        error: (error: HttpErrorResponse) => {},
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Đã xảy ra lỗi không xác định';

        switch (error.status) {
          case 400:
            errorMessage =
              'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
            this.toastService.error(errorMessage);
            console.log('Bad Request Error:', error);
            break;

          case 401:
            errorMessage =
              'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            this.toastService.error(errorMessage);
            this.router.navigate(['/login']);
            break;

          case 403:
            errorMessage = 'Bạn không có quyền truy cập tài nguyên này.';
            this.toastService.warning(errorMessage);
            this.router.navigate(['/access-denied']);
            break;

          case 404:
            errorMessage = '404 - Không tìm thấy tài nguyên yêu cầu.';
            this.toastService.warning(errorMessage);
            break;

          case 408:
            errorMessage = 'Yêu cầu bị timeout. Vui lòng thử lại.';
            this.toastService.warning(errorMessage);
            break;

          case 429:
            errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
            this.toastService.warning(errorMessage);
            break;

          case 500:
            errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
            this.toastService.error(errorMessage);
            break;

          case 502:
            errorMessage = 'Lỗi gateway. Vui lòng thử lại sau.';
            this.toastService.error(errorMessage);
            break;

          case 503:
            errorMessage =
              'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
            this.toastService.error(errorMessage);
            break;

          case 504:
            errorMessage = 'Gateway timeout. Vui lòng thử lại sau.';
            this.toastService.error(errorMessage);
            break;

          default:
            // Xử lý các lỗi network
            if (error.status === 0) {
              errorMessage =
                'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
              this.toastService.error(errorMessage);
            } else {
              this.toastService.error(errorMessage);
            }
            break;
        }

        return throwError(() => error);
      })
    );
  }
}
