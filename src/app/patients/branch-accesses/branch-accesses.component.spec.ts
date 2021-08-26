import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAccessesComponent } from './branch-accesses.component';

describe('BranchAccessesComponent', () => {
  let component: BranchAccessesComponent;
  let fixture: ComponentFixture<BranchAccessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchAccessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchAccessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
