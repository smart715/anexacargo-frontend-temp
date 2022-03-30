import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsNewComponent } from './news-new.component';

describe('NewsNewComponent', () => {
  let component: NewsNewComponent;
  let fixture: ComponentFixture<NewsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
