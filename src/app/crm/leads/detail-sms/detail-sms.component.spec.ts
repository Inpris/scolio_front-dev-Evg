import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSmsComponent } from './detail-sms.component';

describe('DetailSmsComponent', () => {
  let component: DetailSmsComponent;
  let fixture: ComponentFixture<DetailSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailSmsComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
