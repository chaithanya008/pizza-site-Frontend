import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getMenu(): Observable<MenuData> {
    return this.http.get<MenuData>(`${environment.siteUrl}/api/menu`);
  }

  trackOrder(params: any): Observable<any> {
    return this.http.get(`${environment.siteUrl}/api/order`, {params: params});
  }

  placeOrder(body: any): Observable<any> {
    return this.http.post(`${environment.siteUrl}/api/order`, body);
  }
}
