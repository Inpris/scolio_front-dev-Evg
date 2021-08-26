import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UsersService } from '@common/services/users';
import { User } from '@common/models/user';


@Component({
  selector: 'sl-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.less'],
})
export class UserFilterComponent implements OnInit {
  @Input() selectedUserId: string;
  @Output() filterChanged = new EventEmitter<string>();

  users: User[];

  constructor(
    private usersService: UsersService,
  ) {
    this.getUsers();
  }

  ngOnInit() {
  }

  private getUsers() {
    const pageParam = {
      page: 1,
      pageSize: 500,
    };

    this.usersService.getList(pageParam).subscribe((users) => {
      this.users = users.data;
    }, (err) => {
      console.log(err);
    });
  }

  applayFilter(event) {
    if (event) { return; }
    this.filterChanged.next(this.selectedUserId);
  }

  resetFilter() {
    this.selectedUserId = null;
    this.filterChanged.next(this.selectedUserId);
  }
}
