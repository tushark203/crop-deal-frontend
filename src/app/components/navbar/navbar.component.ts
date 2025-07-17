import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    
  token:any;
  email:string|null="";
  role:string|null="";
  userId:number|null=0;

  constructor(private router: Router ,private authService: AuthService) { 
  }

  isLoggedIn(): boolean {

    if(localStorage.getItem('jwt')!== null)
    {
       this.role = this.authService.getLoginInfo().role();
       this.email = this.authService.getLoginInfo().email();
       this.userId = this.authService.getLoginInfo().userId();
    }
    return !!localStorage.getItem('jwt'); 
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }

   goToDashboard(): void {
    if (this.role === 'FARMER') {
      this.router.navigate([`/farmer/dashboard`]);
    } else if (this.role === 'DEALER') {
      this.router.navigate([`/dealer/dashboard`]);
    }else if (this.role === 'ADMIN') {
      this.router.navigate([`/admin/dashboard`]);
    } else {
      this.router.navigate(['/']);
    }
  }

  getLoginInfo()
  {
    
  }
}
