import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoBlockEditorComponent } from './additional-info-block-editor.component';

describe('AdditionalInfoBlockEditorComponent', () => {
  let component: AdditionalInfoBlockEditorComponent;
  let fixture: ComponentFixture<AdditionalInfoBlockEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalInfoBlockEditorComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInfoBlockEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
