import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UsersService } from '@common/services/users';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { ProductStatus } from '@common/enums/product-status.enum';

@Component({
  selector: 'sl-order-issue',
  templateUrl: './order-issue.component.html',
  styleUrls: ['./order-issue.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(OrderIssueComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderIssueComponent extends FormValueAccessor implements OnInit {

  @Input()
  public users;
  @Output()
  deviceIssuedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  generalStatus = ProductStatus;
  fromPaginationChunk = response => response.data;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public usersService: UsersService,
  ) {
    super();
    this.form = fb.group({
      issuer1: [null],
      issuer2: [null],
      generalStatus: [null],
    });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  setDeviceIssued() {
    this.form.patchValue({
      generalStatus: ProductStatus.GIVEN,
    });
    this.deviceIssuedEvent.emit();
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.users) {
      if (this.usersService.users$.value) {
        this.users = this.usersService.users$.value.data.map(user => ({ id: user.id, name: user.abbreviatedName }));
      } else {
        this.usersService.getList({ pageSize: 1000 })
          .map(this.fromPaginationChunk)
          .subscribe(users => this.users = users.map(user => ({ id: user.id, name: user.abbreviatedName })));
      }
    }
  }
}
