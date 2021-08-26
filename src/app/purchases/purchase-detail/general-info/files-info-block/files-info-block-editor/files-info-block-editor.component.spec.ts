import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesInfoBlockEditorComponent } from './files-info-block-editor.component';

describe('FilesInfoBlockEditorComponent', () => {
  let component: FilesInfoBlockEditorComponent;
  let fixture: ComponentFixture<FilesInfoBlockEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilesInfoBlockEditorComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesInfoBlockEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
