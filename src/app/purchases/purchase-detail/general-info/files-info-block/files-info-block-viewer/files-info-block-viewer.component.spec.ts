import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesInfoBlockViewerComponent } from './files-info-block-viewer.component';

describe('FilesInfoBlockViewerComponent', () => {
  let component: FilesInfoBlockViewerComponent;
  let fixture: ComponentFixture<FilesInfoBlockViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilesInfoBlockViewerComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesInfoBlockViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
