import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DealerService } from '../../services/dealer.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/authSer/auth.service';
import { CropService } from '../../services/crop.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule,FormsModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent {
  bookings: any[] = [];
  cropDetailsMap = new Map<number, any>();
  dealerId: number | null = 0;

  selectedBooking: any = null;
  cancelQuantity = 0;
  showCancelForm = false;
  errorMessage = '';
  successMessage = '';
  constructor(
    private dealerService: DealerService,
    private auth: AuthService,
    private cropService: CropService
  ) { 

  }

  ngOnInit(): void {
    this.dealerId = this.auth.getLoginInfo().userId();
    this.fetchBookings();
    this.myPayments();
  }



  fetchBookings() {
    this.dealerService.getMyBookedCrops(this.dealerId).subscribe((res: any[]) => {
      this.bookings = res;
      res.forEach(booking => {
        this.cropService.getCropById(booking.cropId).subscribe(
          (data: any) => {
            this.cropDetailsMap.set(booking.cropId, data);
          }
        )
      })

    })
  }

  openCancelForm(booking: any): void {
    this.selectedBooking = booking;
    this.cancelQuantity = 0;
    this.showCancelForm = true;
  }

  confirmCancel(){
    if (!this.selectedBooking || this.cancelQuantity <= 0) return;
    const { dealerId, cropId } = this.selectedBooking;

    
    this.dealerService.cancelBooking(dealerId,cropId,this.cancelQuantity).subscribe({
      next: () => {
        this.successMessage = 'Booking cancelled successfully';
        this.showCancelForm = false;
        this.fetchBookings(); // reload
      },
      error: () => this.errorMessage = 'Failed to cancel booking'
    });

  }

  

  getCropName(cropId: number): string {
    return this.cropDetailsMap.get(cropId)?.crop_name || 'Loading...';
  }

  getCropType(cropId: number): string {
    return this.cropDetailsMap.get(cropId)?.crop_type || '';
  }

  getFarmerIdFromCrop(cropId: number)
  {
    return this.cropDetailsMap.get(cropId)?.farmer_id;
  }
  showPaymentForm = false;
selectedPayment: any = null;
paymentList=[];

myPayments()
{
  this.dealerService.getMyPayments(this.dealerId).subscribe((data:any)=>{
    this.paymentList = data;
  },(err:any)=>{
    console.log(err);
  })
}
// getPaymentStatus(bookingObj:any)
// {
//   this.paymentList.forEach((payment:any) =>{
//     if(bookingObj.amount === payment.amount && bookingObj.cropId === payment.crop_id && bookingObj.dealerId === payment.dealer_id && payment.farmer_id === this.getFarmerIdFromCrop(bookingObj.cropId))
//     {
//       return true;
//     }
//   })

//   return false;
// }
getPaymentStatus(bookingObj: any): boolean {
  console.log(this.paymentList)
  return this.paymentList.some((payment: any) => {
    return (
      bookingObj.amount === payment.amount &&
      bookingObj.cropId === payment.cropId &&
      bookingObj.dealerId === payment.dealerId &&
      payment.farmerId === this.getFarmerIdFromCrop(bookingObj.cropId)
    );
  });
}


openPaymentForm(booking: any): void {
  this.selectedPayment = booking;
  this.showPaymentForm = true;
}

confirmPayment(): void {
  if (!this.selectedPayment) return;

  const paymentPayload = {
    dealerId: this.selectedPayment.dealerId,
    farmerId: this.getFarmerIdFromCrop(this.selectedPayment.cropId),
    cropId: this.selectedPayment.cropId,
    amount: this.selectedPayment.amount
  };

  console.log(this.selectedPayment)

  this.dealerService.makePayment(paymentPayload)
    .subscribe({
      next: (data) => {
        console.log(data);
         const razorpayOrder = JSON.parse(data); 


        const options: any = {
        key: 'rzp_test_O55bLwCTcCQqnP',
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'Crop Booking',
        description: 'Payment for crop booking',
        order_id: razorpayOrder.id, // Razorpay order_id
        handler: (res: any) => {
          alert('✅ Payment successful! Payment ID: ' + res.razorpay_payment_id);
          this.showPaymentForm = false;
          this.fetchBookings();
           this.myPayments();
        },
        prefill: {
          name: 'Tushar Kuvalekar',
          email: 'tushar200392@gmail.com',
          contact: '9999999999'
        },
        theme: {
          color: '#0d6efd'
        }
      };

       const rzp = new (window as any).Razorpay(options);
      rzp.open();

        this.successMessage = '✅ Payment successful';
        this.showPaymentForm = false;
        this.fetchBookings(); // reload updated status
      },
      error: () => {
        this.errorMessage = '❌ Payment failed. Try again.';
      }
    });
}

	// 4111 1111 1111 1111
  //123
  //123456


}
