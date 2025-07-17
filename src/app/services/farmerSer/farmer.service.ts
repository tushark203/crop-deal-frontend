import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Farmer } from '../../models/farmer.model';

@Injectable({
  providedIn: 'root'
})
export class FarmerService {

 url = "http://localhost:8000/farmer";
  constructor(private http: HttpClient) { }



  getFarmerById(userId:any) {

    return this.http.get(`${this.url}/profile/${userId}`)
  }

  editProfile(userId:any,obj:Farmer)
  {
    return this.http.put(`${this.url}/profile/edit/${userId}`,obj,{responseType:"text"})
  }

  getFarmersCrop(userId:any)
  {
    return this.http.get(`${this.url}/${userId}/MyCrops`);
  }

  getBankDet(userId:any)
  {
    return this.http.get(`${this.url}/bankDetails/${userId}`)
  }

  updateBankDet(userId:any,obj:any)
  {
    return this.http.put(`http://localhost:8000/farmer/${userId}/add-bank-details`,obj,{responseType:"text"})
  }

  publishCrop(userId:any,obj:any)
  {
    return this.http.post(`${this.url}/${userId}/publish-crop`,obj,{responseType:"text"})
  }



}
