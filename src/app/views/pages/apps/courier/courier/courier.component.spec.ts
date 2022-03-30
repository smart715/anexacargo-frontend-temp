import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierComponent } from './courier.component';

describe('CourierComponent', () => {
  let component: CourierComponent;
  let fixture: ComponentFixture<CourierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
