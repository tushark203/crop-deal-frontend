import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CropService } from './crop.service';

fdescribe('CropService', () => {
  let service: CropService;
  let httpMock: HttpTestingController;

  const dummyCrop = {
    id: 1,
    name: 'Wheat',
    quantity: 100,
    price: 50,
    farmerId: 1
  };

  const updatedCrop = {
    name: 'Updated Wheat',
    quantity: 200,
    price: 55
  };

  const farmerId = 1;
  const cropId = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CropService]
    });

    service = TestBed.inject(CropService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all crops', () => {
    const dummyCrops = [dummyCrop];

    service.getAllCrops().subscribe((res) => {
      expect(res).toEqual(dummyCrops);
    });

    const req = httpMock.expectOne('http://localhost:8000/crop/allCrops');
    expect(req.request.method).toBe('GET');
    req.flush(dummyCrops);
  });

  it('should get crop by ID', () => {
    service.getCropById(cropId).subscribe((res) => {
      expect(res).toEqual(dummyCrop);
    });

    const req = httpMock.expectOne(`http://localhost:8000/crop/${cropId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCrop);
  });

  it('should edit crop by ID', () => {
    service.editCropById(farmerId, cropId, updatedCrop).subscribe((res) => {
      expect(res).toBe('Crop updated');
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/${farmerId}/edit-crop/${cropId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCrop);
    req.flush('Crop updated');
  });

  it('should delete crop by ID', () => {
    service.deleteCropById(farmerId, cropId).subscribe((res) => {
      expect(res).toBe('Crop deleted');
    });

    const req = httpMock.expectOne(`http://localhost:8000/farmer/${farmerId}/delete-crop/${cropId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Crop deleted');
  });

  it('should get farmer details by ID', () => {
    const farmerDetails = {
      id: farmerId,
      name: 'Farmer Name',
      crops: [dummyCrop]
    };

    service.getFarmerDet(farmerId).subscribe((res) => {
      expect(res).toEqual(farmerDetails);
    });

    const req = httpMock.expectOne(`http://localhost:8000/crop/farmer-det/${farmerId}`);
    expect(req.request.method).toBe('GET');
    req.flush(farmerDetails);
  });

});

