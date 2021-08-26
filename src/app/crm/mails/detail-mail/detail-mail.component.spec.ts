import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMailComponent } from './detail-mail.component';

describe('DetailMailComponent', () => {
  let component: DetailMailComponent;
  let fixture: ComponentFixture<DetailMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailMailComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
