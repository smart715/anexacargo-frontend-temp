import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryProofComponent } from './delivery-proof.component';

describe('DeliveryProofComponent', () => {
  let component: DeliveryProofComponent;
  let fixture: ComponentFixture<DeliveryProofComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryProofComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
