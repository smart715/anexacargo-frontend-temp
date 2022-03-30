import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqCategoryNewComponent } from './faq-category-new.component';

describe('FaqCategoryNewComponent', () => {
  let component: FaqCategoryNewComponent;
  let fixture: ComponentFixture<FaqCategoryNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqCategoryNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqCategoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
