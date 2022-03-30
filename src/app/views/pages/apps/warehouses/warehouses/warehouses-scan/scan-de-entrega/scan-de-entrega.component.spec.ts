import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanDeEntregaComponent } from './scan-de-entrega.component';

describe('ScanDeEntregaComponent', () => {
  let component: ScanDeEntregaComponent;
  let fixture: ComponentFixture<ScanDeEntregaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanDeEntregaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanDeEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
