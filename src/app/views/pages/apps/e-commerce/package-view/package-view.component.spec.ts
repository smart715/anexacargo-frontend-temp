import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageViewComponent } from './package-view.component';

describe('PackageViewComponent', () => {
  let component: PackageViewComponent;
  let fixture: ComponentFixture<PackageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
