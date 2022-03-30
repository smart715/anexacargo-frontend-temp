import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WgroupsComponent } from './wgroups.component';

describe('WgroupsComponent', () => {
  let component: WgroupsComponent;
  let fixture: ComponentFixture<WgroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WgroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
