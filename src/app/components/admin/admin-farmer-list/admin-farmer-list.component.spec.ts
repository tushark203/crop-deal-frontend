import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFarmerListComponent } from './admin-farmer-list.component';

describe('AdminFarmerListComponent', () => {
  let component: AdminFarmerListComponent;
  let fixture: ComponentFixture<AdminFarmerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFarmerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFarmerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
