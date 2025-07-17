import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userObj: any = {
    email: '',
    password: '',
  };

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

  constructor(private http: HttpClient) {}

  login(userObj: any) {
    const url = 'http://localhost:8000/user/login';
    return this.http.post(url, userObj);
  }

  registerFarmer(registerObj:any)
  {
    const url = 'http://localhost:8000/user/farmer-register';
    return this.http.post(url, registerObj,{ responseType: 'text' });
  }

  registerDealer(registerObj:any)
  {
    const url = 'http://localhost:8000/user/dealer-register';
    return this.http.post(url, registerObj,{ responseType: 'text' });
  }
}
