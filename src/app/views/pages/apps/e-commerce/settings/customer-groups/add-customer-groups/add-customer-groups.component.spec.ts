import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerGroupsComponent } from './add-customer-groups.component';

describe('AddCustomerGroupsComponent', () => {
  let component: AddCustomerGroupsComponent;
  let fixture: ComponentFixture<AddCustomerGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomerGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
