import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePsbComponent } from './create_psb.component';

describe('CreatePsbComponent', () => {
  let component: CreatePsbComponent;
  let fixture: ComponentFixture<CreatePsbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePsbComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePsbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});