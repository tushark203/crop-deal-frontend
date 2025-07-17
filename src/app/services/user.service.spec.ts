// import { TestBed } from '@angular/core/testing';

// import { UserService } from './user.service';

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(UserService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import {  HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';

fdescribe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const dummyUser = {
    email: 'test@example.com',
    password: 'password123'
  };

  const dummyRegister = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    address: '123 Street',
    district: 'SomeDistrict',
    pincode: '123456',
    phone_no: '9876543210',
    password: 'password'
  };

 beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [UserService]
  });

  service = TestBed.inject(UserService);
  httpMock = TestBed.inject(HttpTestingController);
});

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login', () => {
    service.login(dummyUser).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8000/user/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyUser);
    req.flush({ token: 'mock-jwt-token' });
  });

  it('should register a farmer', () => {
    service.registerFarmer(dummyRegister).subscribe((res) => {
      expect(res).toBe('Farmer Registered Successfully');
    });

    const req = httpMock.expectOne('http://localhost:8000/user/farmer-register');
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('text');
    req.flush('Farmer Registered Successfully');
  });

  it('should register a dealer', () => {
    service.registerDealer(dummyRegister).subscribe((res) => {
      expect(res).toBe('Dealer Registered Successfully');
    });

    const req = httpMock.expectOne('http://localhost:8000/user/dealer-register');
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('text');
    req.flush('Dealer Registered Successfully');
  });
});
