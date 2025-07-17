import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCropListComponent } from './admin-crop-list.component';

describe('AdminCropListComponent', () => {
  let component: AdminCropListComponent;
  let fixture: ComponentFixture<AdminCropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCropListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
