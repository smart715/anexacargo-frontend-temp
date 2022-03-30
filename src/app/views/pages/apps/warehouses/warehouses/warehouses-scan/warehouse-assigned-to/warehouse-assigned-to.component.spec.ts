import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseAssignedToComponent } from './warehouse-assigned-to.component';

describe('WarehouseAssignedToComponent', () => {
  let component: WarehouseAssignedToComponent;
  let fixture: ComponentFixture<WarehouseAssignedToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseAssignedToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseAssignedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
