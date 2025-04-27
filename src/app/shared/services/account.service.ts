import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable,of } from "rxjs";
import { environment } from "../../../../public/environments/environment";
import { AccountUser } from "../interface/account.interface";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private _backendUrl = "http://localhost:3000/fastkart"

  constructor(private http: HttpClient) {}

  getUserDetails(userId: any):   Observable<AccountUser | null> {
    if (!userId) {
      return of(null); // Avoid unnecessary API calls if userId is missing
    }
    return this.http.get<AccountUser>(`${this._backendUrl}/user/${userId}`, { withCredentials: true });
  }
  createAddress(formData: any):   Observable<AccountUser | null> {
    
    return this.http.post<AccountUser>(`${this._backendUrl}/createAddress`, formData,  { withCredentials: true });
  }
  updateAddress(formData: any, _id: string): Observable<AccountUser | null> {
    return this.http.put<AccountUser>(`${this._backendUrl}/updateAddress/${_id}`, formData, { withCredentials: true });
  }
  

}
