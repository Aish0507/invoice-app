import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authenticationService: AuthService,
    private tostr: ToastrService,
    private router: Router) { }

  ngOnInit(): void { }
  login(loginForm: NgForm) {
    this.authenticationService.login(loginForm.value.email,
      loginForm.value.password).subscribe(data => {
        if (!data.error) {
          setTimeout(() => {
            this.router.navigate(['/product']);
          }, 300);
        } else {
          this.tostr.error('Error', 'User not found');
        }
      })
  }
}
