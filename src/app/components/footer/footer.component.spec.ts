import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct website email', () => {
    const emailElement = fixture.debugElement.query(By.css('a[href^="mailto:"]')).nativeElement;
    expect(emailElement.textContent).toContain('info@cropdeal.com');
  });

  it('should contain navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('a[routerLink]'));
    const linkRoutes = links.map(el => el.attributes['ng-reflect-router-link']);
    expect(linkRoutes).toContain('/');
    expect(linkRoutes).toContain('/all-crops');
    expect(linkRoutes).toContain('/register/farmer');
    expect(linkRoutes).toContain('/register/dealer');
  });

  it('should display the app name', () => {
    const title = fixture.debugElement.query(By.css('h4')).nativeElement;
    expect(title.textContent).toContain('Crop Deal');
  });

  it('should display contact information', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('+91 99999 99999');
    expect(text).toContain('Pune, India');
  });

  it('should display copyright', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('© 2025 Crop Deal. All Rights Reserved.');
  });
});
