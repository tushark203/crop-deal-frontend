import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FarmerBankDetailsComponent } from './farmer-bank-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FarmerService } from '../../services/farmerSer/farmer.service';
import { AuthService } from '../../services/authSer/auth.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

fdescribe('FarmerBankDetailsComponent', () => {
  let component: FarmerBankDetailsComponent;
  let fixture: ComponentFixture<FarmerBankDetailsComponent>;
  let farmerServiceSpy: jasmine.SpyObj<FarmerService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    farmerServiceSpy = jasmine.createSpyObj('FarmerService', ['getBankDet']);
    farmerServiceSpy.getBankDet.and.returnValue(of({}));



    await TestBed.configureTestingModule({
  imports: [
    FarmerBankDetailsComponent,
    HttpClientTestingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: FarmerService, useValue: farmerServiceSpy },
    {
      provide: AuthService,
      useValue: {
        getLoginInfo: () => ({
          userId: () => 'mock-farmer-id'
        })
      }
    },
    {
      provide: ActivatedRoute,
      useValue: {
        params: of({ farmerId: 'mock-farmer-id' }) // mock route params
      }
    }
  ]
}).compileComponents();

    fixture = TestBed.createComponent(FarmerBankDetailsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    expect(component.bankForm).toBeDefined();
    expect(component.bankForm.controls['bankName']).toBeTruthy();
  });

  it('should fetch and patch bank details if data exists', fakeAsync(() => {
    const mockDetails = {
      bankName: 'SBI',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      upiId: 'sbi@upi',
      upiNumber: '9876543210'
    };
    farmerServiceSpy.getBankDet.and.returnValue(of(mockDetails));
    component.ngOnInit();
    tick();

    expect(component.bankDetails).toEqual(mockDetails);
    expect(component.bankForm.value.bankName).toBe('SBI');
    expect(component.isEditMode).toBeTrue();
  }));

  it('should handle empty response gracefully', fakeAsync(() => {
    farmerServiceSpy.getBankDet.and.returnValue(of({}));
    component.ngOnInit();
    tick();

    expect(component.bankDetails).toBeNull();
    expect(component.isEditMode).toBeFalse();
  }));

  it('should open form and set edit mode', () => {
    component.bankDetails = { bankName: 'ICICI' };
    component.openForm();
    expect(component.showForm).toBeTrue();
    expect(component.isEditMode).toBeTrue();
  });

  it('should reset form and patch old data on cancel', () => {
    const details = {
      bankName: 'HDFC',
      accountNumber: '2222222222',
      ifscCode: 'HDFC0001234',
      upiId: '',
      upiNumber: ''
    };
    component.bankDetails = details;
    component.initForm();
    component.bankForm.patchValue(details);
    component.cancel();

    expect(component.showForm).toBeFalse();
    expect(component.bankForm.value.bankName).toBe('HDFC');
  });

  it('should not submit form if invalid', () => {
    component.initForm();
    component.bankForm.controls['bankName'].setValue('');
    component.submit();
    expect(component.bankForm.invalid).toBeTrue();
  });

  it('should submit form in edit mode and send PUT request', fakeAsync(() => {
    spyOn(window, 'alert');
    component.farmerId = 'mock-farmer-id';
    component.isEditMode = true;
    component.bankForm.setValue({
      bankName: 'Union Bank',
      accountNumber: '1231231230',
      ifscCode: 'UBIN0004567',
      upiId: '',
      upiNumber: ''
    });

    component.submit();

    const req = httpMock.expectOne('http://localhost:8000/farmer/mock-farmer-id/update-bank-details');
    expect(req.request.method).toBe('PUT');
    req.flush('Bank details updated');

    tick();
    expect(window.alert).toHaveBeenCalledWith('Bank details updated!');
    expect(component.showForm).toBeFalse();
  }));

  it('should submit form in add mode and send POST request', fakeAsync(() => {
    spyOn(window, 'alert');
    component.farmerId = 'mock-farmer-id';
    component.isEditMode = false;
    component.bankForm.setValue({
      bankName: 'Canara Bank',
      accountNumber: '111122223333',
      ifscCode: 'CNRB0005678',
      upiId: 'canara@upi',
      upiNumber: '9123456780'
    });

    component.submit();

    const req = httpMock.expectOne('http://localhost:8000/farmer/mock-farmer-id/add-bank-details');
    expect(req.request.method).toBe('POST');
    req.flush('Bank details added');

    tick();
    expect(window.alert).toHaveBeenCalledWith('Bank details added!');
    expect(component.showForm).toBeFalse();
  }));

  it('should handle error on form submit', fakeAsync(() => {
    spyOn(window, 'alert');
    component.farmerId = 'mock-farmer-id';
    component.isEditMode = true;
    component.bankForm.setValue({
      bankName: 'Error Bank',
      accountNumber: '0000000000',
      ifscCode: 'ERR000000',
      upiId: '',
      upiNumber: ''
    });

    component.submit();

    const req = httpMock.expectOne('http://localhost:8000/farmer/mock-farmer-id/update-bank-details');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    tick();
    expect(window.alert).toHaveBeenCalledWith('Failed to update/add bank details');
  }));
});
