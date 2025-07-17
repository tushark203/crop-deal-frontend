import { CommonModule } from '@angular/common';
import { Component, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  constructor(private userService: UserService, private authService: AuthService) { }
  router = inject(Router);
  role = "";
  userId = 0;
  email = "";

  userObj: any = {
    email: '',
    password: '',
  };
  onLogin() {
    this.userService.login(this.userObj).subscribe({
      next: (res: any) => {
        if (res) {
          alert('Login success');
          localStorage.setItem('jwt', res.token); // Consider setting a named token key

          if (res.token) {
            const payload = JSON.parse(atob(res.token.split('.')[1]));
            this.role = payload.role;
            this.userId = payload.userId;
            this.email = payload.sub;
            this.loginUser();

          }

          if (this.role === "FARMER") {
            this.router.navigateByUrl(`/farmer/dashboard`);
          }
          else if (this.role === "DEALER") {
            this.router.navigateByUrl(`/dealer/dashboard`);
          }
          else if (this.role === "ADMIN") {
            this.router.navigateByUrl(`/admin/dashboard`);
          }

        } else {
          alert('Wrong credentials');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed. Check console for details.');
      },
    });
  }

  loginUser() {
    this.authService.setLoginInfo({
      role: this.role,
      userId: this.userId,
      email: this.email
    });
  }
}
