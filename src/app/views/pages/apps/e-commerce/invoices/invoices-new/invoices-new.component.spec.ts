import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesNewComponent } from './invoices-new.component';

describe('InvoicesNewComponent', () => {
  let component: InvoicesNewComponent;
  let fixture: ComponentFixture<InvoicesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
