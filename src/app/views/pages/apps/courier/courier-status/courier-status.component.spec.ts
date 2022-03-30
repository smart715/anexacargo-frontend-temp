import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierStatusComponent } from './courier-status.component';

describe('CourierStatusComponent', () => {
  let component: CourierStatusComponent;
  let fixture: ComponentFixture<CourierStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
