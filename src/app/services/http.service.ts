import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // url = 'https://bumagi-frontend-test.herokuapp.com'
  url = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) { }

  login(formValue: any) {
    const headers = new HttpHeaders({});
    const formData: FormData = new FormData();
    formData.append('login', formValue.login);
    formData.append('password', formValue.password);
    return this.http.post(`${this.url}/auth`, formData, {headers: headers})
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getUsers(status: string | number) {
    if (status === 'all') {
      return this.http.get(`${this.url}/users`)
    }
    return this.http.get(`${this.url}/users?status=${status}`)
  }

  updateUser(data:any) {
    const headers = new HttpHeaders({});
    const formData: FormData = new FormData();
    formData.append('body', JSON.stringify(data));
    return this.http.patch(`${this.url}/users/${data.id}`, formData);
  }
}
