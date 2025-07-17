import { Component, OnInit } from '@angular/core';
import { FarmerService } from '../../services/farmerSer/farmer.service';
import { Farmer } from '../../models/farmer.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-farmer-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './farmer-profile.component.html',
  styleUrl: './farmer-profile.component.css'
})
export class FarmerProfileComponent implements OnInit {

  isEditing = false;
  farmerProfile: Farmer = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    district: '',
    pincode: '',
    phone_no: ''
  };

  farmerId:any ;

  constructor(private route: ActivatedRoute,private farmerService: FarmerService,private authService:AuthService) { }
  ngOnInit(): void {

  this.farmerId = this.authService.getLoginInfo().userId();

    this.getFarmerDetails(this.farmerId);
  }


  getFarmerDetails(id: number) {
    this.farmerService.getFarmerById(id).subscribe((data: any) => {
      this.farmerProfile = data;
      console.log(data);
    });
  }

  updateProfile(id:number,obj:Farmer)
  {
      this.farmerService.editProfile(id,obj).subscribe((data:any)=>{
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
   this.farmerProfile = val;
   this.updateProfile(id,this.farmerProfile);
  this.enableEditing()
}
}
