import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropReviewsComponent } from './crop-reviews.component';

describe('CropReviewsComponent', () => {
  let component: CropReviewsComponent;
  let fixture: ComponentFixture<CropReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
