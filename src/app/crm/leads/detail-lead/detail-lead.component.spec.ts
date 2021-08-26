import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLeadComponent } from './detail-lead.component';

describe('DetailLeadComponent', () => {
  let component: DetailLeadComponent;
  let fixture: ComponentFixture<DetailLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailLeadComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
