import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';

// Mock standalone components
@Component({
  selector: 'app-navbar',
  standalone: true,
  template: '<div>Mock Navbar</div>',
})
class MockNavbarComponent {}

@Component({
  selector: 'app-footer',
  standalone: true,
  template: '<div>Mock Footer</div>',
})
class MockFooterComponent {}

fdescribe('AppComponent (Standalone)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MockNavbarComponent,
        MockFooterComponent,
      ],
      providers: [
        provideRouter([]), // if router-outlet is used
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the AppComponent', () => {
    expect(component).toBeTruthy();
  });

  it(`should have title 'CropDeal'`, () => {
    expect(component.title).toBe('CropDeal');
  });

  it('should render navbar, router-outlet, and footer', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
