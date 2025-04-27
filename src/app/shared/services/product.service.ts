import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../public/environments/environment';
import { ProductModel } from '../interface/product.interface';
import { Params } from '../interface/core.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public skeletonLoader: boolean = false;
  private _backendUrl = "http://localhost:3000/fastkart"


  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this._backendUrl}/products`, { withCredentials: true });
  }

}
