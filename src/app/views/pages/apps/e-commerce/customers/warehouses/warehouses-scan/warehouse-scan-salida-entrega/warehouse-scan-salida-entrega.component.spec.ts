import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseScanSalidaEntregaComponent } from './warehouse-scan-salida-entrega.component';

describe('WarehouseScanSalidaEntregaComponent', () => {
  let component: WarehouseScanSalidaEntregaComponent;
  let fixture: ComponentFixture<WarehouseScanSalidaEntregaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseScanSalidaEntregaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseScanSalidaEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
