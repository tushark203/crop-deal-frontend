import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { RegisterComponent } from './register.component';
import { UserService } from '../../services/user.service';

fdescribe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      params: of({ role: 'farmer' })
    };

    userServiceSpy = jasmine.createSpyObj('UserService', ['registerFarmer', 'registerDealer']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [FormsModule,RegisterComponent],
      providers: [
        TitleCasePipe,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize role from route params', () => {
    expect(component.role).toBe('farmer');
  });


  it('should call registerFarmer and navigate on success', fakeAsync(() => {
    component.role = 'farmer';
    component.registerObj = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      address: '123 Street',
      district: 'District',
      pincode: '123456',
      phone_no: '9876543210',
      password: 'password'
    };

    userServiceSpy.registerFarmer.and.returnValue(of('Farmer registered successfully'));

    component.onRegister('farmer');
    tick();

    expect(userServiceSpy.registerFarmer).toHaveBeenCalledWith(component.registerObj);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
  }));

  
  it('should call registerDealer and navigate on success', fakeAsync(() => {
    component.role = 'dealer';
    component.registerObj = {
      ...component.registerObj,
      email: 'dealer@example.com'
    };

    userServiceSpy.registerDealer.and.returnValue(of('Dealer registered successfully'));

    component.onRegister('dealer');
    tick();

    expect(userServiceSpy.registerDealer).toHaveBeenCalledWith(component.registerObj);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
  }));


  it('should have required form fields invalid when empty', () => {
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    expect(form.checkValidity()).toBeFalse();
  });


  it('should invalidate the email field with wrong format', fakeAsync(() => {
    const emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
    emailInput.value = 'invalidEmail';
    emailInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    expect(emailInput.checkValidity()).toBeFalse();
  }));


  it('should validate the form with correct inputs', fakeAsync(() => {
    component.registerObj = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      address: '456 Avenue',
      district: 'City',
      pincode: '654321',
      phone_no: '1234567890',
      password: 'pass1234'
    };
    fixture.detectChanges();
    tick();

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    expect(form.checkValidity()).toBeTrue();
  }));

 
  it('should NOT navigate if farmer registration fails (unexpected response)', fakeAsync(() => {
    userServiceSpy.registerFarmer.and.returnValue(of('Unexpected response'));

    component.onRegister('farmer');
    tick();

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  }));



});
