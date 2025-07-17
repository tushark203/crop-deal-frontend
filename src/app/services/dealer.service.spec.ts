import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DealerService } from './dealer.service';
import { Dealer } from '../models/dealer.model';

fdescribe('DealerService', () => {
  let service: DealerService;
  let httpMock: HttpTestingController;

  const dummyDealer:any= {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    address: '123 Street',
    district: 'SomeDistrict',
    pincode: '123456',
    phone_no: '9876543210',
    password: 'password',
    user_type: 'dealer'
  };

  const dummyBankDetails = {
    accountNumber: '1234567890',
    ifscCode: 'SBIN0000123',
    bankName: 'State Bank',
    branchName: 'Main Branch'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DealerService]
    });

    service = TestBed.inject(DealerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dealer by ID', () => {
    const userId = 1;
    service.getDealerById(userId).subscribe((res) => {
      expect(res).toEqual(dummyDealer);
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/profile/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDealer);
  });

  it('should edit dealer profile', () => {
    const userId = 1;
    service.editProfile(userId, dummyDealer).subscribe((res) => {
      expect(res).toBe('Profile updated');
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/profile/edit/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dummyDealer);
    req.flush('Profile updated');
  });

  it('should get bank details', () => {
    const userId = 1;
    service.getBankDet(userId).subscribe((res) => {
      expect(res).toEqual(dummyBankDetails);
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/bankDetails/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBankDetails);
  });

  it('should update bank details', () => {
    const userId = 1;
    service.updateBankDet(userId, dummyBankDetails).subscribe((res) => {
      expect(res).toBe('Bank details updated');
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/${userId}/add-bank-details`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dummyBankDetails);
    req.flush('Bank details updated');
  });

  it('should book crop', () => {
    const userId = 1;
    const cropId = 10;
    const reqQuantity = 50;

    service.bookCrop(userId, cropId, reqQuantity).subscribe((res) => {
      expect(res).toBe('Crop booked');
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/${userId}/book/${cropId}?req_quantity=${reqQuantity}`);
    expect(req.request.method).toBe('POST');
    req.flush('Crop booked');
  });

  it('should get booked crops', () => {
    const dealerId = 1;
    const bookedCrops = [{ cropName: 'Wheat', quantity: 50 }];

    service.getMyBookedCrops(dealerId).subscribe((res) => {
      expect(res).toEqual(bookedCrops);
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/${dealerId}/MyBookedCrops`);
    expect(req.request.method).toBe('GET');
    req.flush(bookedCrops);
  });

  it('should cancel booking', () => {
    const dealerId = 1;
    const cropId = 10;
    const cancelQuantity = 20;

    service.cancelBooking(dealerId, cropId, cancelQuantity).subscribe((res) => {
      expect(res).toBe('Booking cancelled');
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/${dealerId}/cancel-book/${cropId}?cancel_quantity=${cancelQuantity}`);
    expect(req.request.method).toBe('POST');
    req.flush('Booking cancelled');
  });

  it('should make payment', () => {
    const paymentData = {
      cropId: 10,
      dealerId: 1,
      farmerId: 2,
      amount: 5000
    };

    service.makePayment(paymentData).subscribe((res) => {
      expect(res).toBe('Payment successful');
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/make-payement`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(paymentData);
    req.flush('Payment successful');
  });

  it('should get my payments', () => {
    const dealerId = 1;
    const payments = [{
      paymetId: 1,
      cropId: 10,
      farmerId: 2,
      dealerId: 1,
      amount: 5000
    }];

    service.getMyPayments(dealerId).subscribe((res) => {
      expect(res).toEqual(payments);
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/my-payments?dealer_id=${dealerId}`);
    expect(req.request.method).toBe('GET');
    req.flush(payments);
  });

  it('should generate receipt', () => {
    const receiptId = 1;
    const receipt = {
      amount: 5000,
      paidAt: '2023-06-01T12:00:00Z',
      farmerName: 'Farmer One',
      dealerName: 'Dealer One',
      cropName: 'Wheat',
      quantity: 100
    };

    service.generateReceipt(receiptId).subscribe((res) => {
      expect(res).toEqual(receipt);
    });

    const req = httpMock.expectOne(`http://localhost:8000/dealer/receipt/${receiptId}`);
    expect(req.request.method).toBe('GET');
    req.flush(receipt);
  });

});

