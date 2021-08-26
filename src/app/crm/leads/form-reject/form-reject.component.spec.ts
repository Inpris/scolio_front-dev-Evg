import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRejectComponent } from './form-reject.component';
import { RejectResults } from '@common/models/rejectResults';

describe('FormRejectComponent', () => {
  let component: FormRejectComponent;
  let fixture: ComponentFixture<FormRejectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormRejectComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
    // RejectResults
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
