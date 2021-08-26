import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionarySpecificationComponent } from './dictionary-specification.component';

describe('DictionarySpecificationComponent', () => {
  let component: DictionarySpecificationComponent;
  let fixture: ComponentFixture<DictionarySpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DictionarySpecificationComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictionarySpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
