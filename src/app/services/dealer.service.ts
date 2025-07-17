import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dealer } from '../models/dealer.model';
import { Observable } from 'rxjs';


interface Payment {
  paymetId: number;
  cropId: number;
  farmerId: number;
  dealerId: number;
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

@Injectable({
  providedIn: 'root'
})


export class DealerService {

  url = "http://localhost:8000/dealer";
  constructor(private http: HttpClient) { }



  getDealerById(userId: any) {

    return this.http.get(`${this.url}/profile/${userId}`)
  }

  editProfile(userId: any, obj: Dealer) {
    return this.http.put(`${this.url}/profile/edit/${userId}`, obj, { responseType: "text" })
  }


  getBankDet(userId: any) {
    return this.http.get(`${this.url}/bankDetails/${userId}`)
  }

  updateBankDet(userId: any, obj: any) {
    return this.http.put(`http://localhost:8000/dealer/${userId}/add-bank-details`, obj, { responseType: "text" })
  }

  bookCrop(userId: any, cropId: any, reqQuantity: any) {
    return this.http.post(`http://localhost:8000/dealer/${userId}/book/${cropId}?req_quantity=${reqQuantity}`, {}, { responseType: "text" })
  }

  getMyBookedCrops(dealerId: any) {
    return this.http.get<any[]>(`http://localhost:8000/dealer/${dealerId}/MyBookedCrops`);
  }

  cancelBooking(dealerId: any,cropId:any,cancelQuantity:any)
  {
    return this.http.post(`http://localhost:8000/dealer/${dealerId}/cancel-book/${cropId}?cancel_quantity=${cancelQuantity}`,{},{responseType:"text"})
  }

  makePayment(obj:any)
  {
    return this.http.post(`http://localhost:8000/dealer/make-payement`,obj,{responseType:"text"})
  }

  getMyPayments(dealerId: any): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}/my-payments?dealer_id=${dealerId}`);
  }

  generateReceipt(id: number): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.url}/receipt/${id}`);
  }

}
