import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sl-user-roles-description',
  template: `
    <div nz-row nzType="flex" class="role__row">
      <div nz-col nzSpan="14"><b>Роль</b></div>
      <div nz-col nzSpan="9" nzOffset="1"><b>Идентификатор</b></div>
    </div>
    <div nz-row nzType="flex" *ngFor="let role of roles" class="role__row">
      <div nz-col nzSpan="14">{{role.descr}}</div>
      <div nz-col nzSpan="9" nzOffset="1">{{role.name}}</div>
    </div>
    <div class="role__info"><b>Примечание:</b></div>
    <div>Пользователь имеющий несколько ролей будет иметь доступ к модулям, доступ к которым имеет хотя бы одна его роль</div>
  `,
  styles: [`
    :host {
      display: block;
      width: 500px;
    }
    .role__row {
      margin-bottom: 4px;
    }
    .role__info {
      margin-top: 12px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRolesDescriptionComponent {
  public roles = [
    { name: 'admin', descr: 'Суперпользователь' },
    { name: 'user', descr: 'Администратор' },
    { name: 'userManager', descr: 'Руководитель Администраторов' },
    { name: 'doctor', descr: 'Врач' },
    { name: 'worker', descr: 'Техник (робот)' },
    { name: 'workerManager', descr: 'Руководитель Техников (робот)' },
    { name: 'locksmithUser', descr: 'Техник (слесарка)' },
    { name: 'locksmithLead', descr: 'Руководитель Техников (слесарка)' },
    { name: 'callCenter', descr: 'Коллцентр' },
    { name: 'salesManager', descr: 'Отдел продаж' },
    { name: 'xrayMaster', descr: 'Руководитель ОРИ (рентген)' },
  ];
}
