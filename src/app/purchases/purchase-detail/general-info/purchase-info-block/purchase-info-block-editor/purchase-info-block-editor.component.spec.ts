import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInfoBlockEditorComponent } from './purchase-info-block-editor.component';

describe('PurchaseInfoBlockEditorComponent', () => {
  let component: PurchaseInfoBlockEditorComponent;
  let fixture: ComponentFixture<PurchaseInfoBlockEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseInfoBlockEditorComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInfoBlockEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
