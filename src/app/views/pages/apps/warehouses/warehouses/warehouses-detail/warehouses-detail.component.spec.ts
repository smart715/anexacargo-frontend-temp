import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousesDetailComponent } from './warehouses-detail.component';

describe('WarehousesDetailComponent', () => {
  let component: WarehousesDetailComponent;
  let fixture: ComponentFixture<WarehousesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehousesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
