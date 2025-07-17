import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterEvent, RouterLink } from '@angular/router';
import { CropService } from '../../services/crop.service';
import { CropDto } from '../../models/crop.model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/authSer/auth.service';
import { FormsModule } from '@angular/forms';
import { DealerService } from '../../services/dealer.service';
import { Farmer } from '../../models/farmer.model';
import { CropReviewsComponent } from '../../components/crop-reviews/crop-reviews.component';

@Component({
  selector: 'app-crop-details',
  imports: [CommonModule,RouterLink,FormsModule,CropReviewsComponent],
  templateUrl: './crop-details.component.html',
  styleUrl: './crop-details.component.css',
})
export class CropDetailsComponent implements OnInit {
  cropId: number = 0;
  crop!: CropDto;
  farmer!:any;

  dealerId: number|null=0;
  role:string|null = '';
  isBooking = false;
  reqQuantity: number = 1;
  successMessage = '';
  errorMessage = '';
  famerId :number= 0;

  constructor(
    private route: ActivatedRoute,
    private cropService: CropService,
    private http: HttpClient,
    private authService: AuthService,
    private dealerService : DealerService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.cropId = params['id'];
     this.getCropDetails(this.cropId);
    });
  }

  getCropDetails(id: number) {
    this.cropService.getCropById(id).subscribe((data:any)=>{
      this.crop = data;
      this.famerId = data.farmer_id;
      this.getFarmerDetails();
      
    })
  }


   confirmBooking(): void {
    this.dealerService.bookCrop(this.dealerId,this.cropId,this.reqQuantity)
      .subscribe({
        next: () => {
          this.successMessage = '✅ Crop booked successfully!';
          this.isBooking = false;
          this.getCropDetails(this.cropId)
        },
        error: (err) =>{
          this.errorMessage = '❌ Booking failed. Please try again.'
          console.log(err)
        } 
      });
  }

 
  openBooking(): void {
    this.role = this.authService.getLoginInfo().role();
    this.dealerId = this.authService.getLoginInfo().userId();
    if (this.role !== 'DEALER') {
      
      this.errorMessage = '⚠️ Please login as a dealer to book this crop.'
      return;
    }
    this.isBooking = true;
  }

  getFarmerDetails()
  {
    this.cropService.getFarmerDet(this.famerId).subscribe((data)=>{
      this.farmer = data;
    },(err)=>{
      console.log(err)
    })
  }
}
