import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { User } from '../model/User';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url = environment.apiUrl;
  auth_token! :string | null
  constructor(private http: HttpClient, private router: Router) { }

  login(form: FormArray | FormGroup) {
    const headers = new HttpHeaders({});

    const formJson = {
      "login": form.value.login,
      "password": form.value.password
    }

    return this.http.post(`${this.url}/auth`, formJson, { headers: headers, observe: 'response' })
       .pipe(map(data => {
         this.auth_token = data.headers.get('Authorization');
         if (this.auth_token !== null) { localStorage.setItem('token', this.auth_token)}
         return data;
       }))

  }

  getToken() {
    this.auth_token = localStorage.getItem('token')
    return this.auth_token
  }

  isLoggedIn() {
    return !!localStorage.getItem('token')
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getUsers(status: null | number) {
    if (status === null) {
      return this.http.get(`${this.url}/users`)
    }
    return this.http.get(`${this.url}/users?status=${status}`)
  }

  updateUser(data: User) {
    return this.http.patch(`${this.url}/users/${data.id}`, data, {observe: 'response' });
  }
}
