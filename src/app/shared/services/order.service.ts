import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../public/environments/environment';
import { CheckoutPayload, OrderCheckout, OrderModel } from '../interface/order.interface';
import { Params } from '../interface/core.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public skeletonLoader: boolean = false;
  private _backendUrl = "http://localhost:3000/fastkart"

  constructor(private http: HttpClient) {}

  getOrders(payload?: Params): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${environment.URL}/order.json`, { params: payload });
  }
  // viewOrder(orderNumber: number): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/${orderNumber}`);
  // }

  checkout(payload: CheckoutPayload): Observable<OrderCheckout> {
    return this.http.post<OrderCheckout>(`${this._backendUrl}/checkout`, payload);
  }

  // placeOrder(payload: CheckoutPayload): Observable<PlaceOrder> {
  //   return this.http.post<PlaceOrder>(`${this.baseUrl}`, payload);
  // }

  // verifyPayment(payload: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/verify-payment`, payload);
  // }

  // rePayment(payload: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/re-payment`, payload);
  // }

}


