import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInfoBlockViewerComponent } from './purchase-info-block-viewer.component';

describe('PurchaseInfoBlockViewerComponent', () => {
  let component: PurchaseInfoBlockViewerComponent;
  let fixture: ComponentFixture<PurchaseInfoBlockViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseInfoBlockViewerComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInfoBlockViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
