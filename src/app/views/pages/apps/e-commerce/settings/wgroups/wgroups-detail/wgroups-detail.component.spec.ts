import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WgroupsDetailComponent } from './wgroups-detail.component';

describe('WgroupsDetailComponent', () => {
  let component: WgroupsDetailComponent;
  let fixture: ComponentFixture<WgroupsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WgroupsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WgroupsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
