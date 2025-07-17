// import { CommonModule, DatePipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { DealerService } from '../../services/dealer.service';
// import { AuthService } from '../../services/authSer/auth.service';

// interface Payment {
//   paymetId: string;
//   cropId: string;
//   farmerId: string;
//   amount: number;
// }
// @Component({
//   selector: 'app-my-payments',
//   imports: [CommonModule,DatePipe],
//   templateUrl: './my-payments.component.html',
//   styleUrl: './my-payments.component.css'
// })

// export class MyPaymentsComponent implements OnInit {

//   dealerId:any;
//   private paymentList: Payment[] = [];

//   constructor(private route: ActivatedRoute,private dealerService : DealerService,private authService : AuthService) {}

//   ngOnInit(): void {
//   this.dealerId = this.authService.getLoginInfo().userId();
//     this.fetchPayments();
//   }

//   payments(): Payment[] {
//     return this.paymentList;
//   }

//   fetchPayments(): void {
//     this.dealerService.getMyPayments(this.dealerId).subscribe((data:any)=>
//     {
//       this.paymentList = data;
//     })

//   }

//   getCropName(paymentId:any){

//    let details:any = this.getReceipt(paymentId);
//     return details.cropName || 'Unknown';

//   }

//   getFarmerName(paymentId:any) {
//    let details:any = this.getReceipt(paymentId);
//     return details.farmerName || 'Unknown';
//   }
//     getQuantity(paymentId:any) {
//    let details:any = this.getReceipt(paymentId);
//     return details.quantity || 'Unknown';
//   }

//      getDate(paymentId:any) {
//    let details:any = this.getReceipt(paymentId);
//     return details.paidAt || 'Unknown';
//   }

//    getReceipt(paymentId:any) {

//     this.dealerService.generateReceipt(paymentId).subscribe((data)=>{
//       console.log("called");
//       console.log(data);
//     },(err)=>{
//       console.log(err);
//     })
//     alert(`Downloading receipt for payment ID: ${paymentId}`);
//   }

// }

import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { DealerService } from '../../services/dealer.service';
import { AuthService } from '../../services/authSer/auth.service';
import jsPDF from 'jspdf';

interface Payment {
  paymetId: number;
  cropId: number;
  farmerId: number;
  amount: number;
}

interface Receipt {
  amount: number;
  paidAt: string;
  farmerName: string;
  dealerName: string;
  cropName: string;
  quantity: number;
}

@Component({
  selector: 'app-my-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-payments.component.html',
  styleUrl: './my-payments.component.css',
})
export class MyPaymentsComponent implements OnInit {
  dealerId: any;
  private paymentList: Payment[] = [];
  receiptMap: Map<number, Receipt> = new Map();

  constructor(
    private dealerService: DealerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.dealerId = this.authService.getLoginInfo().userId()!;
    this.fetchPayments();
  }

  payments(): Payment[] {
    return this.paymentList;
  }

  fetchPayments(): void {
    this.dealerService
      .getMyPayments(this.dealerId)
      .subscribe((data: Payment[]) => {
        this.paymentList = data;

        // Fetch and store receipts for each payment
        data.forEach((payment) => {
          this.dealerService
            .generateReceipt(payment.paymetId)
            .subscribe((receipt: Receipt) => {
              this.receiptMap.set(payment.paymetId, receipt);
            });
        });
      });
  }

  getReceiptData(paymentId: number): Receipt | null {
    return this.receiptMap.get(paymentId) || null;
  }

  // downloadReceipt(paymentId: number): void {
  //   const receipt = this.getReceiptData(paymentId);
  //   if (receipt) {
  //     console.log("Receipt info:", receipt);
  //     alert(`Receipt for ₹${receipt.amount} paid to ${receipt.farmerName} on ${receipt.paidAt}`);
  //   }
  // }
//   downloadReceipt(paymentId: number): void {
//     const receipt = this.getReceiptData(paymentId);
//     if (receipt) {
//       const content = `
// Receipt
// -------
// Crop Name: ${receipt.cropName}
// Farmer Name: ${receipt.farmerName}
// Quantity: ${receipt.quantity}
// Amount Paid: ₹${receipt.amount}
// Date: ${receipt.paidAt}
// `;

    
//       const blob = new Blob([content], { type: 'text/plain' });
//       const url = window.URL.createObjectURL(blob);

     
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `receipt_${paymentId}.txt`;
//       link.click();

     
//       window.URL.revokeObjectURL(url);
//     } else {
//       alert('Receipt data not available yet. Please try again in a moment.');
//     }
//   }

downloadReceipt(paymentId: number): void {
  const receipt = this.getReceiptData(paymentId);

  if (!receipt) {
    alert('Receipt data not available yet. Please try again in a moment.');
    return;
  }

  const doc = new jsPDF();
  //add watermark
  //   doc.setFontSize(50);
  // doc.setTextColor(200, 200, 200); 
  // doc.text('Crop Deal', 105, 150, { align: 'center', angle: 45 });

  // Add title "Crop Deal" centered
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Crop Deal', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  let y = 40;

  // Add receipt details
  doc.text(`Dealer Name: ${receipt.dealerName}`, 20, y); y += 10;
  doc.text(`Farmer Name: ${receipt.farmerName}`, 20, y); y += 10;
  doc.text(`Crop Name: ${receipt.cropName}`, 20, y); y += 10;
  doc.text(`Quantity: ${receipt.quantity} units`, 20, y); y += 10;
  doc.text(`Amount Paid: ₹${receipt.amount}`, 20, y); y += 10;
  doc.text(`Date of Payment: ${receipt.paidAt}`, 20, y); y += 10;

  // Save the PDF
  doc.save(`receipt_${paymentId}.pdf`);
}
}
