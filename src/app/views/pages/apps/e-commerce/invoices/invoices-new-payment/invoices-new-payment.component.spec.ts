import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesNewPaymentComponent } from './invoices-new-payment.component';

describe('InvoicesNewPaymentComponent', () => {
  let component: InvoicesNewPaymentComponent;
  let fixture: ComponentFixture<InvoicesNewPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesNewPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesNewPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
