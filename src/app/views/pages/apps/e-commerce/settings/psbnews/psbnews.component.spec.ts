import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsbAddComponent } from './psbnews.component';

describe('PsbAddComponent', () => {
  let component: PsbAddComponent;
  let fixture: ComponentFixture<PsbAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PsbAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsbAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
