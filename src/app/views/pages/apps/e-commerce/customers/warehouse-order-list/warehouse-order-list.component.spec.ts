import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOrderListComponent } from './warehouse-order-list.component';

describe('WarehouseOrderListComponent', () => {
  let component: WarehouseOrderListComponent;
  let fixture: ComponentFixture<WarehouseOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
