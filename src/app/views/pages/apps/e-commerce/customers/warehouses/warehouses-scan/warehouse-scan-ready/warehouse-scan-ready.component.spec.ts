import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseScanReadyComponent } from './warehouse-scan-ready.component';

describe('WarehouseScanReadyComponent', () => {
  let component: WarehouseScanReadyComponent;
  let fixture: ComponentFixture<WarehouseScanReadyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseScanReadyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseScanReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
