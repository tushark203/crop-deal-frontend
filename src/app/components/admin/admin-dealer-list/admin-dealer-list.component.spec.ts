import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDealerListComponent } from './admin-dealer-list.component';

describe('AdminDealerListComponent', () => {
  let component: AdminDealerListComponent;
  let fixture: ComponentFixture<AdminDealerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDealerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDealerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
