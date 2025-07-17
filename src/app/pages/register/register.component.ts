import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule,TitleCasePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerObj: any = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    district: '',
    pincode: '',
    phone_no: '',
    password: '',
  };

  role:string=""
   router = inject(Router);

   constructor(
    private route: ActivatedRoute,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.role = params['role'];
    });
  }

  onRegister(apiRole:string){
    if(apiRole==="farmer")
    {
      this.userService.registerFarmer(this.registerObj).subscribe((res:any)=>{
        console.log(res);
        if(res==='Farmer registered successfully')
        {
          this.router.navigateByUrl('');
        }
      })
    }
    else if(apiRole==="dealer")
    {
      this.userService.registerDealer(this.registerObj).subscribe((res:any)=>{
        console.log(res);
        if(res==='Dealer registered successfully')
        {
          this.router.navigateByUrl('');
        }
      })
    }
  
  }

}
