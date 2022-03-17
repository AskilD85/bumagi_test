import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url = 'https://bumagi-frontend-test.herokuapp.com'
  constructor(private http: HttpClient) { }

  auth(formValue: any) {
    const headers = new HttpHeaders({});
    const formData: FormData = new FormData();
    formData.append('login', formValue.login);
    formData.append('password', formValue.password);
    return this.http.post(`${this.url}/auth`, formData, {headers: headers})
  }
}
