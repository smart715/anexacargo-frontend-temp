import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPricingComponent } from './edit-pricing.component';

describe('EditPricingComponent', () => {
  let component: EditPricingComponent;
  let fixture: ComponentFixture<EditPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
