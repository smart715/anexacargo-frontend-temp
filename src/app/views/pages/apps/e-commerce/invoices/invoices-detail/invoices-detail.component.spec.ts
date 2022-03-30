import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesDetailComponent } from './invoices-detail.component';

describe('InvoicesDetailComponent', () => {
  let component: InvoicesDetailComponent;
  let fixture: ComponentFixture<InvoicesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
