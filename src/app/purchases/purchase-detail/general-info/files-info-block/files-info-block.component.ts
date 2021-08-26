import { Component } from '@angular/core';

@Component({
  selector: 'sl-files-info-block',
  templateUrl: './files-info-block.component.html',
  styleUrls: ['./files-info-block.component.less'],
})
export class FilesInfoBlockComponent {

  isEditMode = false;

  constructor() { }

  onChangeMode(isEdit) {
    this.isEditMode = isEdit;
  }
}
