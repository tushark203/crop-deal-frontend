import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DealerBankDetailsComponent } from './dealer-bank-details.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DealerService } from '../../services/dealer.service';
import { AuthService } from '../../services/authSer/auth.service';

fdescribe('DealerBankDetailsComponent', () => {
  let component: DealerBankDetailsComponent;
  let fixture: ComponentFixture<DealerBankDetailsComponent>;
  let dealerServiceSpy: jasmine.SpyObj<DealerService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    dealerServiceSpy = jasmine.createSpyObj('DealerService', ['getBankDet']);
    dealerServiceSpy.getBankDet.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [DealerBankDetailsComponent, HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: DealerService, useValue: dealerServiceSpy },
        {
          provide: AuthService,
          useValue: {
            getLoginInfo: () => ({
              userId: () => 'mock-dealer-id'
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DealerBankDetailsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.bankForm).toBeDefined();
    expect(component.bankForm.controls['bankName']).toBeTruthy();
  });

  it('should fetch bank details and populate form if data exists', fakeAsync(() => {
    const mockBankDetails = {
      bankName: 'HDFC Bank',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      upiId: 'john@upi',
      upiNumber: '9876543210'
    };

    dealerServiceSpy.getBankDet.and.returnValue(of(mockBankDetails));
    component.ngOnInit();
    tick();

    expect(component.bankDetails).toEqual(mockBankDetails);
    expect(component.bankForm.value.bankName).toBe('HDFC Bank');
    expect(component.isEditMode).toBeTrue();
  }));

  it('should handle empty bank data gracefully', fakeAsync(() => {
    dealerServiceSpy.getBankDet.and.returnValue(of({}));
    component.ngOnInit();
    tick();

    expect(component.bankDetails).toBeNull();
    expect(component.isEditMode).toBeFalse();
  }));

  it('should open the form and set edit mode if bankDetails exist', () => {
    component.bankDetails = { bankName: 'SBI' };
    component.openForm();

    expect(component.showForm).toBeTrue();
    expect(component.isEditMode).toBeTrue();
  });

  it('should reset the form and retain values on cancel', () => {
    component.bankDetails = {
      bankName: 'ICICI',
      accountNumber: '1234567890',
      ifscCode: 'ICIC0001234',
      upiId: 'icici@upi',
      upiNumber: '9999999999'
    };
    component.initForm();
    component.bankForm.patchValue(component.bankDetails);
    component.showForm = true;

    component.cancel();

    expect(component.showForm).toBeFalse();
    expect(component.bankForm.value.bankName).toBe('ICICI');
  });

  it('should not submit if form is invalid', () => {
    component.initForm();
    component.bankForm.controls['bankName'].setValue('');
    component.submit();

    expect(component.bankForm.invalid).toBeTrue();
  });

  it('should make PUT request on submit in edit mode', fakeAsync(() => {
    spyOn(window, 'alert');

    component.bankDetails = {
      bankName: 'Axis',
      accountNumber: '1111111111',
      ifscCode: 'AXIS0001234',
      upiId: '',
      upiNumber: ''
    };
    component.isEditMode = true;
    component.showForm = true;
    component.bankForm.patchValue(component.bankDetails);

    component.submit();

    const req = httpMock.expectOne('http://localhost:8000/dealer/mock-dealer-id/update-bank-details');
    expect(req.request.method).toBe('PUT');
    req.flush('Bank details updated');

    tick();
    expect(window.alert).toHaveBeenCalledWith('Bank details updated!');
    expect(component.showForm).toBeFalse();
  }));

  it('should make POST request on submit in add mode', fakeAsync(() => {
    spyOn(window, 'alert');

    component.bankDetails = null;
    component.isEditMode = false;
    component.showForm = true;
    component.bankForm.patchValue({
      bankName: 'Union',
      accountNumber: '9999999999',
      ifscCode: 'UBIN0001234',
      upiId: 'union@upi',
      upiNumber: '1231231230'
    });

    component.submit();

    const req = httpMock.expectOne('http://localhost:8000/dealer/mock-dealer-id/add-bank-details');
    expect(req.request.method).toBe('POST');
    req.flush('Bank details added');

    tick();
    expect(window.alert).toHaveBeenCalledWith('Bank details added!');
    expect(component.showForm).toBeFalse();
  }));

  it('should handle HTTP error on submit gracefully', fakeAsync(() => {
    spyOn(window, 'alert');

    component.isEditMode = true;
    component.showForm = true;
    component.bankForm.patchValue({
      bankName: 'Invalid Bank',
      accountNumber: '000',
      ifscCode: 'INVALID',
      upiId: '',
      upiNumber: ''
    });

    component.submit();

    const req = httpMock.expectOne('http://localhost:8000/dealer/mock-dealer-id/update-bank-details');
    expect(req.request.method).toBe('PUT');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });

    tick();
    expect(window.alert).toHaveBeenCalledWith('Failed to update/add bank details');
  }));
});
