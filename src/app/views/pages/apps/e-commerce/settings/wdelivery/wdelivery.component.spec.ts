import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WdeliveryComponent } from './wdelivery.component';

describe('WdeliveryComponent', () => {
  let component: WdeliveryComponent;
  let fixture: ComponentFixture<WdeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WdeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WdeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
