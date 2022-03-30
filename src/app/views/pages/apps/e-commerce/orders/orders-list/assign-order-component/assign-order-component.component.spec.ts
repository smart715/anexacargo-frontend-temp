import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignOrderComponentComponent } from './assign-order-component.component';

describe('AssignOrderComponentComponent', () => {
  let component: AssignOrderComponentComponent;
  let fixture: ComponentFixture<AssignOrderComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignOrderComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignOrderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
