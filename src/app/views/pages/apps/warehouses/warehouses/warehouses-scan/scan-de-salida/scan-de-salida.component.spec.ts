import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanDeSalidaComponent } from './scan-de-salida.component';

describe('ScanDeSalidaComponent', () => {
  let component: ScanDeSalidaComponent;
  let fixture: ComponentFixture<ScanDeSalidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanDeSalidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanDeSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
