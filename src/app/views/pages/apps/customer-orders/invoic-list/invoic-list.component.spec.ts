import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicListComponent } from './invoic-list.component';

describe('InvoicListComponent', () => {
  let component: InvoicListComponent;
  let fixture: ComponentFixture<InvoicListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
