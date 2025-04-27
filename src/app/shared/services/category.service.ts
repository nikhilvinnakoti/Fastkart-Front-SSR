import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../public/environments/environment";
import { Params } from "../interface/core.interface";
import { CategoryModel } from "../interface/category.interface";
import { CategoryResponse } from "../interface/category.interface";
@Injectable({
  providedIn: "root",
})
export class CategoryService {
   private _backendUrl = "http://localhost:3000/fastkart"

  constructor(private http: HttpClient) {}

  getCategories(){
    return this.http.get<CategoryResponse>(`${this._backendUrl}/categories`, {withCredentials: true });
  }
  
}