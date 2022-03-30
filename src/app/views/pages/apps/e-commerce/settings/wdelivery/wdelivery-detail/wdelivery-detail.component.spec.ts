import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WdeliveryDetailComponent } from './wdelivery-detail.component';

describe('WdeliveryDetailComponent', () => {
  let component: WdeliveryDetailComponent;
  let fixture: ComponentFixture<WdeliveryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WdeliveryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WdeliveryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
