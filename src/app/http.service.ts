import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MenuData } from './model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  // Fetch menu items
  getMenu(): Observable<MenuData> {
    return this.http.get<MenuData>(`${environment.siteUrl}/api/menu`);
  }

  // Track order with order id and contact number
  trackOrder(params: any): Observable<any> {
    return this.http.get(`${environment.siteUrl}/api/order`, {params: params});
  }

  // Place new order
  placeOrder(body: any): Observable<any> {
    return this.http.post(`${environment.siteUrl}/api/order`, body);
  }
}
