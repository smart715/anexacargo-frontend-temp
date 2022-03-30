import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWarehouseStatusComponent } from './change-warehouse-status.component';

describe('ChangeWarehouseStatusComponent', () => {
  let component: ChangeWarehouseStatusComponent;
  let fixture: ComponentFixture<ChangeWarehouseStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeWarehouseStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeWarehouseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
