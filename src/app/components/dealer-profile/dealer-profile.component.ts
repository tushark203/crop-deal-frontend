import { Component } from '@angular/core';
import { Dealer } from '../../models/dealer.model';
import { ActivatedRoute } from '@angular/router';
import { DealerService } from '../../services/dealer.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-dealer-profile',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './dealer-profile.component.html',
  styleUrl: './dealer-profile.component.css'
})
export class DealerProfileComponent {

   isEditing = false;
  dealerProfile: Dealer = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    district: '',
    pincode: '',
    phone_no: ''
  };

  dealerId :any;

  constructor(private route: ActivatedRoute,private dealerService: DealerService,private authService:AuthService) { }
  ngOnInit(): void {

  this.dealerId = this.authService.getLoginInfo().userId();

    this.getDealerDetails(this.dealerId);
  }


  getDealerDetails(id: number) {
    this.dealerService.getDealerById(id).subscribe((data: any) => {
      this.dealerProfile = data;
      console.log(data);
    });
  }

  updateProfile(id:number,obj:Dealer)
  {
      this.dealerService.editProfile(id,obj).subscribe((data:any)=>{
            console.log(data);
      } , (err:any)=>{
        console.log(err);
      })
  }

  enableEditing()
  {
    this.isEditing = !this.isEditing;
  }
  
onSubmit(id:number,val:any)
{
   console.log(val);
   this.dealerProfile = val;
   this.updateProfile(id,this.dealerProfile);
  this.enableEditing()
}

}
