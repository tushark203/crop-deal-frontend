import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerProfileComponent } from './dealer-profile.component';

describe('DealerProfileComponent', () => {
  let component: DealerProfileComponent;
  let fixture: ComponentFixture<DealerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
