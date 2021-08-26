import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekSheduleComponent } from './week-shedule.component';

describe('WeekSheduleComponent', () => {
  let component: WeekSheduleComponent;
  let fixture: ComponentFixture<WeekSheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeekSheduleComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
