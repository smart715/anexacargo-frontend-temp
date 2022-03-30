import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTrackingComponent } from './public-tracking.component';

describe('PublicTrackingComponent', () => {
  let component: PublicTrackingComponent;
  let fixture: ComponentFixture<PublicTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
