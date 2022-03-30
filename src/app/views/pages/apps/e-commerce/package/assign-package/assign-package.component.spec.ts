import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPackageComponent } from './assign-package.component';

describe('AssignPackageComponent', () => {
  let component: AssignPackageComponent;
  let fixture: ComponentFixture<AssignPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
