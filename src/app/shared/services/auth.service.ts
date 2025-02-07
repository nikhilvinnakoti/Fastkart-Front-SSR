import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  public redirectUrl: string | undefined;

  // Auth Function Here
  private _signUpUrl = "http://localhost:3000/fastkart/signup"
  constructor(private http: HttpClient){}
  signUpUrl(user: any){
    return this.http.post<any>(this._signUpUrl,user)
  }
  
}
