import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPackageTypeComponent } from './add-package-type.component';

describe('AddPackageTypeComponent', () => {
  let component: AddPackageTypeComponent;
  let fixture: ComponentFixture<AddPackageTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPackageTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPackageTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
