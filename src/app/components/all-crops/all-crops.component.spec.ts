import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllCropsComponent } from './all-crops.component';
import { CropService } from '../../services/crop.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

fdescribe('AllCropsComponent', () => {
  let component: AllCropsComponent;
  let fixture: ComponentFixture<AllCropsComponent>;

  const mockCrops = [
    { crop_id: 1, crop_name: 'Wheat', price_per_kg: 25, imageUrl: '' },
    { crop_id: 2, crop_name: 'Rice', price_per_kg: 30, imageUrl: '' },
    { crop_id: 3, crop_name: 'Corn', price_per_kg: 20, imageUrl: '' },
    { crop_id: 4, crop_name: 'Bajra', price_per_kg: 22, imageUrl: '' },
    { crop_id: 5, crop_name: 'Jowar', price_per_kg: 28, imageUrl: '' },
    { crop_id: 6, crop_name: 'Barley', price_per_kg: 24, imageUrl: '' },
    { crop_id: 7, crop_name: 'Millet', price_per_kg: 27, imageUrl: '' },
    { crop_id: 8, crop_name: 'Oats', price_per_kg: 26, imageUrl: '' },
    { crop_id: 9, crop_name: 'Ragi', price_per_kg: 29, imageUrl: '' },
  ];

  class MockCropService {
    getAllCrops() {
      return of(mockCrops);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCropsComponent, CommonModule, RouterTestingModule],
      providers: [{ provide: CropService, useClass: MockCropService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AllCropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and store all crops on init', () => {
    expect(component.allCrops.length).toBe(mockCrops.length);
    expect(component.paginatedCrops.length).toBeLessThanOrEqual(component.cropsPerPage);
  });

  it('should return correct number of homepage crops (max 8)', () => {
    expect(component.homepageCrops.length).toBe(8);
  });

  it('should paginate correctly on next and previous', () => {
    component.cropsPerPage = 3;
    component.updatePagination();
    expect(component.paginatedCrops.length).toBe(3);

    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should calculate total pages correctly', () => {
    component.cropsPerPage = 4;
    component.updatePagination();
    expect(component.totalPages).toBe(Math.ceil(mockCrops.length / 4));
  });

  it('should switch from homepage to all crops view', () => {
    component.onHome = true;
    component.setOnHome();
    expect(component.onHome).toBeFalse();
  });
});
