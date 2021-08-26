import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoBlockViewerComponent } from './additional-info-block-viewer.component';

describe('AdditionalInfoBlockViewerComponent', () => {
  let component: AdditionalInfoBlockViewerComponent;
  let fixture: ComponentFixture<AdditionalInfoBlockViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalInfoBlockViewerComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInfoBlockViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
