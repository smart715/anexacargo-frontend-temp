import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLabelComponent } from './print-label.component';

describe('PrintLabelComponent', () => {
  let component: PrintLabelComponent;
  let fixture: ComponentFixture<PrintLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
