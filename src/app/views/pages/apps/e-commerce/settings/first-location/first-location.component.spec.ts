import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLocationComponent } from './first-location.component';

describe('FirstLocationComponent', () => {
    let component: FirstLocationComponent;
    let fixture: ComponentFixture<FirstLocationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FirstLocationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FirstLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
