import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authSer/auth.service';
import { signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockAuthService {
  private _role: WritableSignal<string | null> = signal('FARMER');
  private _email: WritableSignal<string | null> = signal('test@example.com');
  private _userId: WritableSignal<number | null> = signal(123);

  getLoginInfo() {
    return {
      role: this._role,
      email: this._email,
      userId: this._userId
    };
  }
}

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: () => null
    },
    queryParams: {},
    data: {}
  },
  params: of({}),
  queryParams: of({}),
  data: of({})
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // ✅ Fix here
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create the navbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should return false from isLoggedIn() if no token exists', () => {
    expect(component.isLoggedIn()).toBeFalse();
  });

  it('should return true from isLoggedIn() and populate auth info if token exists', () => {
    localStorage.setItem('jwt', 'mock-token');
    expect(component.isLoggedIn()).toBeTrue();
    expect(component.role).toBe('FARMER');
    expect(component.email).toBe('test@example.com');
    expect(component.userId).toBe(123);
  });

  it('should navigate to root and clear token on logout', () => {
    localStorage.setItem('jwt', 'mock-token');
    component.logout();
    expect(localStorage.getItem('jwt')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to correct dashboard based on role', () => {
    localStorage.setItem('jwt', 'mock-token');
    component.isLoggedIn(); // Populate info
    component.goToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['/farmer/dashboard']);
  });
});
