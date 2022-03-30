import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierDetailComponent } from './courier-detail.component';

describe('CourierDetailComponent', () => {
  let component: CourierDetailComponent;
  let fixture: ComponentFixture<CourierDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
