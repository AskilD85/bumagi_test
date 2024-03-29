import { Component, OnInit, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpService } from './../services/http.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              private httpService: HttpService,
              private router: Router) {
    iconRegistry.addSvgIcon('view-password', sanitizer.bypassSecurityTrustResourceUrl('../../assets/view.svg'));
    iconRegistry.addSvgIcon('no-view-password', sanitizer.bypassSecurityTrustResourceUrl('../../assets/no-view.svg'));
  }
  svg_variable = 'view-password';
  type_text = 'password';
  error_text!: string;

  loginForm:FormGroup = new FormGroup({
    login: new FormControl('test@example.com', Validators.required),
    password: new FormControl('1q2w3e', [Validators.minLength(6), Validators.required]),
  }

  )


  ngOnInit(): void {
    // if (this.httpService.isLoggedIn()) {this.router.navigate(['/users'])}
  }

  sendForm(){
    this.error_text =''
    this.httpService.login(this.loginForm).subscribe({
      next: () => {
        this.loginForm.reset(),
        this.router.navigate(['users']) },
      error: (err) => {console.log(err.error.message), this.error_text = err.error.message},

    })
  }

  /** кнопка  показать/скрыть пароль */
 show_hide_password() {

  if (this.svg_variable === 'view-password') {
        this.svg_variable = 'no-view-password';
     this.type_text = 'text'
   } else {
     this.svg_variable = 'view-password';
     this.type_text = 'password'
   }
  }
}
