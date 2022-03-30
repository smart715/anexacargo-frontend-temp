import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierNewComponent } from './courier-new.component';

describe('CourierNewComponent', () => {
  let component: CourierNewComponent;
  let fixture: ComponentFixture<CourierNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
