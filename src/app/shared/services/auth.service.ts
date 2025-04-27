import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  public redirectUrl: string | undefined;

  // Auth Function Here
  private _backendUrl = "http://localhost:3000/fastkart"
  constructor(private http: HttpClient){}
  signUp(user: any){
    return this.http.post<any>(`${this._backendUrl}/signup`,user, {
      withCredentials: true,  // Send cookies with the request
    })
  }

  login(user: any){
    return this.http.post<any>(`${this._backendUrl}/login`,user, {
      withCredentials: true,  // Send cookies with the request
    })
  }
  

  // Call to backend to logout the user (clear refresh token)
  logout(): Observable<any> {
    return this.http.post(`${this._backendUrl}/logout`, {}, { withCredentials: true });
  }

   // ✅ Refresh access token using the refresh token stored in HTTP-only cookies
   refreshToken(): Observable<any> {
    return this.http.post(`${this._backendUrl}/refresh-token`, {}, { withCredentials: true });
  }
}
