import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageScanComponent } from './package-scan.component';

describe('PackageScanComponent', () => {
  let component: PackageScanComponent;
  let fixture: ComponentFixture<PackageScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
