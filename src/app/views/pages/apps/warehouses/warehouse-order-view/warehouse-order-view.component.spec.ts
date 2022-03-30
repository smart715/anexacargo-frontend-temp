import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOrderViewComponent } from './warehouse-order-view.component';

describe('WarehouseOrderViewComponent', () => {
  let component: WarehouseOrderViewComponent;
  let fixture: ComponentFixture<WarehouseOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
