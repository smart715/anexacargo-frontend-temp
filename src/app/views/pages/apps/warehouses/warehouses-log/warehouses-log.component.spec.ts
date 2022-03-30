import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousesLogComponent } from './warehouses-log.component';

describe('WarehousesLogComponent', () => {
  let component: WarehousesLogComponent;
  let fixture: ComponentFixture<WarehousesLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehousesLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousesLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
