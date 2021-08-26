import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { AuthService } from '@common/services/auth';
import { User } from '@common/models/user';
import { LayoutScrollService } from '@common/helpers/layout-scroll.service';

@Component({
  selector: 'sl-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent {
  user: User;
  scrollSubj;

  constructor(
    private authService: AuthService,
    private modalService: NzModalService,
    private router: Router,
    private layoutScrollService: LayoutScrollService,
  ) {
    this.user = this.authService.user;
    this.scrollSubj = this.layoutScrollService.getSubject();
  }

  logout() {
    this.modalService.warning({
      nzTitle: 'Вы действительно хотите выйти?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.authService.logout().subscribe(() => this.router.navigate(['login']));
      },
    });
  }

  onScroll(e) {
    if (+e.target.scrollTop + +e.target.clientHeight > e.target.scrollHeight - 50) {
      this.scrollSubj.next('bottom');
    }
  }
}
