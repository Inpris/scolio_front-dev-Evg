import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TaskItem } from '@common/interfaces/Task-item';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'sl-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
})
export class CardComponent implements OnInit {
  @Input() data: TaskItem;

  @ViewChild('formTaskModalContent')
  private formTaskModalContent: any;

  modalTaskForm: NzModalRef;

  constructor(
    private modalService: NzModalService,
  ) { }

  ngOnInit() {}

  getPath(data) {
    let path = '/crm/leads';
    if (data.entityType === 'Contact') {
      path = '/patients';
    }
    return [path, data.entity.id];
  }

  // task form
  openModalTaskForm() {
    this.modalTaskForm = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.formTaskModalContent,
      nzFooter: null,
      nzWidth: '600px',
    });
  }

  closeModalTaskForm(data) {
    this.modalTaskForm.close();
  }
  // end task form

}
