import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierFinalComponent } from './courier-final.component';

describe('CourierFinalComponent', () => {
  let component: CourierFinalComponent;
  let fixture: ComponentFixture<CourierFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
