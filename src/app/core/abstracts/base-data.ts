import { Observable } from 'rxjs';

export abstract class BaseData {
  baseUrl: string | undefined;
  state: any;
  abstract getState(): Observable<any>;
  abstract search(params: any, isPost?: boolean): Observable<any>;
  abstract findByCode(code: string): Observable<any>;
  abstract create(data: any): Observable<any>;
  abstract update(data: any): Observable<any>;
  abstract delete(id: string): Observable<void>;
  abstract exportExcel(fileName: string, params: any): Observable<boolean>;
}

