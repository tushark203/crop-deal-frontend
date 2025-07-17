

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FarmerService } from './farmer.service';
import { Farmer } from '../../models/farmer.model';
import { CropDto } from '../../models/crop.model';

//focused describe
fdescribe('FarmerService', () => {
  let service: FarmerService;
  let httpMock: HttpTestingController;

  const userId = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FarmerService]
    });

    service = TestBed.inject(FarmerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get farmer by ID', () => {
    const mockFarmer = {
      first_name: "John",
      last_name: 'Doe',
      email: 'john@example.com',
      address: '123 Street',
      district: 'Somewhere',
      pincode: '123456',
      phone_no: '9876543210'
    };

    service.getFarmerById(userId).subscribe(data => {
      expect(data).toEqual(mockFarmer);
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/profile/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFarmer);
  });

  it('should edit farmer profile', () => {
    const updatedFarmer:any = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      address: '456 Avenue',
      district: 'Anywhere',
      pincode: '654321',
      phone_no: '1234567890'
    };

    service.editProfile(userId, updatedFarmer).subscribe(response => {
      expect(response).toBe('Profile updated');
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/profile/edit/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedFarmer);
    req.flush('Profile updated');
  });

  it('should get farmer crops', () => {
    const crops: CropDto[] = [
      {
        crop_id: 1,
        farmer_id: userId,
        crop_name: 'Wheat',
        crop_type: 'Grain',
        quantity_in_kg: 100,
        quantity_available: 80,
        quantity_booked: 20,
        price_per_kg: 25,
        status: 'Published',
        postedAt: '2024-05-01T12:00:00Z'
      }
    ];

    service.getFarmersCrop(userId).subscribe(data => {
      expect(data).toEqual(crops);
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/${userId}/MyCrops`);
    expect(req.request.method).toBe('GET');
    req.flush(crops);
  });

  it('should get bank details', () => {
    const bankDetails = {
      accountNumber: '1111222233334444',
      bankName: 'Test Bank',
      ifsc: 'TEST0001234'
    };

    service.getBankDet(userId).subscribe(data => {
      expect(data).toEqual(bankDetails);
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/bankDetails/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(bankDetails);
  });

  it('should update bank details', () => {
    const bankUpdate = {
      accountNumber: '4444333322221111',
      bankName: 'Updated Bank',
      ifsc: 'UPDT0001234'
    };

    service.updateBankDet(userId, bankUpdate).subscribe(response => {
      expect(response).toBe('Bank details updated');
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/${userId}/add-bank-details`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(bankUpdate);
    req.flush('Bank details updated');
  });

  it('should publish crop', () => {
    const cropToPublish: Partial<CropDto> = {
      crop_name: 'Corn',
      crop_type: 'Grain',
      quantity_in_kg: 150,
      price_per_kg: 30,
      status: 'Draft'
    };

    service.publishCrop(userId, cropToPublish).subscribe(response => {
      expect(response).toBe('Crop published');
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/${userId}/publish-crop`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cropToPublish);
    req.flush('Crop published');
  });
});
