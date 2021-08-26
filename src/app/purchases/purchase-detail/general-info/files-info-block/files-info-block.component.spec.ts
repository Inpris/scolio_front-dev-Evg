import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesInfoBlockComponent } from './files-info-block.component';

describe('FilesInfoBlockComponent', () => {
  let component: FilesInfoBlockComponent;
  let fixture: ComponentFixture<FilesInfoBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilesInfoBlockComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesInfoBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
