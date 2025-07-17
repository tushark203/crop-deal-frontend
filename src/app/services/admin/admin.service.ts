import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }
  url = "http://localhost:8000/admin"

  getAllFarmers(): Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/farmer/allFarmers`);
  }

  editFarmer(id: number, farmer: any) {
  return this.http.put(`http://localhost:8000/admin/farmer/profile/edit/${id}`, farmer,{responseType:"text"});
}

deleteFarmer(id: number) {
  return this.http.delete(`http://localhost:8000/admin/farmer/delete/${id}`,{responseType:"text"});
}

getAllDealers():Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/dealer/allDealers`);
  }

  editDealer(id: number, farmer: any) {
  return this.http.put(`http://localhost:8000/admin/dealer/profile/edit/${id}`, farmer,{responseType:"text"});
}

deleteDealer(id: number) {
  return this.http.delete(`http://localhost:8000/admin/dealer/delete/${id}`,{responseType:"text"});
}

getAllCrops():Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/crop/allCrops`);
  }

  deleteCrop(cropId: number) {
  return this.http.delete(`${this.url}/crop/delete/${cropId}`,{responseType:"text"});
}

}
