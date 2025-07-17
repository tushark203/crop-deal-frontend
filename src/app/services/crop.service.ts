import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CropService {

  constructor(private http:HttpClient) { }
  
  getAllCrops()
  {
     const url = "http://localhost:8000/crop/allCrops";
     return this.http.get(url);
  }

  getCropById(id:number)
  {
    const url = `http://localhost:8000/crop/${id}`
    return this.http.get(url)
  }

  editCropById(farmerId:number,cropId:number,obj:any)
  {
    const url = `http://localhost:8000/farmer/${farmerId}/edit-crop/${cropId}`
    return this.http.put(url,obj,{responseType:"text"});
  }

  deleteCropById(farmerId:number,cropId:number)
  {
    const url = `http://localhost:8000/farmer/${farmerId}/delete-crop/${cropId}`
    return this.http.delete(url,{responseType:"text"});
  }

  getFarmerDet(farmerId:number)
  {
    return this.http.get(`http://localhost:8000/crop/farmer-det/${farmerId}`)
  }

   getDealerDet(dealerId:number)
  {
    return this.http.get(`http://localhost:8000/crop/dealer-det/${dealerId}`)
  }

  getAverageRating(cropId: number) {
  return this.http.get<number>(`http://localhost:8000/crop/review/average-rating/${cropId}`);
}

getReviews(cropId: number) {
  return this.http.get<any[]>(`http://localhost:8000/crop/reviews/${cropId}`);
}

submitReview(cropId: number, dealerId: number, body: any) {
  return this.http.post(`http://localhost:8000/dealer/${dealerId}/review-post/${cropId}`, body);
}

}
