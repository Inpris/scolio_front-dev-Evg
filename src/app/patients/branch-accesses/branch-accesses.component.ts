import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {LocalStorage} from "@common/services/storage";
import {ToastsService} from "@common/services/toasts.service";
import {AccessesService} from "@common/services/accesses-service.service";
import {NzMessageService} from "ng-zorro-antd";
import {AuthService} from "@common/services/auth";

@Component({
  selector: 'sl-branch-accesses',
  templateUrl: './branch-accesses.component.html',
  styleUrls: ['./branch-accesses.component.less']
})
export class BranchAccessesComponent implements OnInit {
  @ViewChild('nzTable') nzTable;

  public pending = false;
  public sortMap = {
    sortFullName: '',
    sortBranchName: '',
  };
  public filterMap = {
    fullName: '',
    branchName: '',
  };

  ngOnInit() {
    this.getTableData();
  }

  public accessTableData: any[] = [];
  public scrollContainer;

  public sort() {
    this.getTableData();
  }

  public search() {
    this.getTableData();
  }

  public getTableData(): void {
    this.pending = true;

    const filters = Object.keys(this.filterMap)
      .filter(item => this.filterMap[item])
      .map((item, i) => {
        return i === 0 ? `?${item}=${this.filterMap[item]}` : `&${item}=${this.filterMap[item]}`;
      }).join();

    const sorts = Object.keys(this.sortMap)
      .filter(item => this.sortMap[item])
      .map((item, i) => {
        return i === 0 && !filters ? `?${item}=${this.sortMap[item]}` : `&${item}=${this.sortMap[item]}`;
      }).join();

    this.accessesService.getList(`${filters}${sorts}`).subscribe((response: any[]) => {
      this.accessTableData = response;
      this.pending = false;
    });
  }

  public accessButtonName(code): string {
    return code ? 'Отказать в доступе' : 'Предоставить доступ';
  }

  public access(data: any) {
    const body = {
      hasAccess: +data.hasAccess,
      contactId: data.contactId,
      branchId: data.branchId,
      createdBy: this.authService.user.id
    };

    this.accessesService.changeAccess(body)
      .subscribe((response: any) => {
        this.getTableData();
        this.message.info(response.message, { nzDuration: 3000 });
        this.cd.detectChanges();
      }, (err) => this.toastsService.error(err, { nzDuration: 3000 }));
  }

  public linkToFile(id: string) {
    return `/api/v1/files/${id}`;
  }

  constructor(
    private accessesService: AccessesService,
    storageService: LocalStorage,
    private toastsService: ToastsService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private message: NzMessageService,
  ) {}
}
