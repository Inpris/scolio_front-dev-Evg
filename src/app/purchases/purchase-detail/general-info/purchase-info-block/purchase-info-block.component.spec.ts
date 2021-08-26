import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInfoBlockComponent } from './purchase-info-block.component';

describe('PurchaseInfoBlockComponent', () => {
  let component: PurchaseInfoBlockComponent;
  let fixture: ComponentFixture<PurchaseInfoBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseInfoBlockComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInfoBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
