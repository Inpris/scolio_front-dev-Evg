import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '@common/models/contact';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ContactsService } from '@common/services/contacts';
import { RolesUsers } from '@common/constants/roles-users.constant';

@Component({
  selector: 'sl-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.less'],
})
export class PatientDetailComponent {

  readonly ROLES_USERS = RolesUsers;
  public contact: Contact;
  public lead;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService,
    private contactsService: ContactsService,
  ) {
    this.contact = this.route.parent.snapshot.data.contact;
    this.lead = {
      ...this.contact,
      leadInfo: {
        ...this.contact,
      },
      assignedUser: this.contact,
    };
  }

  actionCallback(action) {
    if (!action || !action.data) { return this.router.navigate(['/patients']); }
    Object.assign(this.contact, action.data);
  }

  public deletePatient() {
    this.contactsService.delete(this.contact.id).subscribe((response) => {
      const message = 'Пациент успешно удален';
      this.message.info(message, { nzDuration: 3000 });
      this.router.navigate(['/patients']);
    }, (err) => {
      const message = 'Возникла непредвиденная ошибка во время удаления пациента';
      this.message.error(message, { nzDuration: 3000 });
    });
  }

  public confirmRemove() {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить пациента?',
      nzContent: 'Это действие удалит все его посещения.',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => { this.deletePatient(); },
      nzZIndex: 1200,
    });
  }

}
