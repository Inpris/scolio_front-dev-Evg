import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { BranchesService } from '@common/services/dictionaries/branches.service';
import { CorsetOrder } from '@common/models/product-order/corset-order';
import { CorsetShortFormData } from '@common/interfaces/product-order/Corset-short-form-data';

@Component({
  selector: 'sl-corset-correction-order',
  templateUrl: './corset-correction-order.component.html',
  styleUrls: ['./corset-correction-order.component.less'],
  providers: [
    BranchesService,
    ...FormValueAccessor.getAccessorProviders(CorsetCorrectionOrderComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorsetCorrectionOrderComponent extends FormValueAccessor implements OnInit {
  @Input()
  visitsManager: VisitsManager;

  @Input()
  measurementData: {};

  @Input()
  device: CorsetOrder;
  @Input()
  corsetData: CorsetShortFormData;

  @Input() set products(products) {
    this.devices = [
      this.devices[0],
      ...products.map(product => ({
        ...product,
        name: `${product.name} ${product.number}`,
        dateOfIssue: new Date(product.dateOfIssue),
      })),
    ];
  }

  public devices = [{ id: null, name: 'Изделие сделаное вне Сколиолоджик', dateOfIssue: null, branch: null }];

  fromPaginationChunk = response => response.data;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public branchService: BranchesService,
  ) {
    super();
    this.form = fb.group({
      name: [null],
      product: [this.devices[0]],
      dateOfIssue: [null, Validators.required],
      dateOfIssueTurner: [null],
      dateSendingToBranch: [null],
      branch: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.form.get('product')
      .valueChanges
      .subscribe((_device) => {
        if (!_device) {
          const lastIssuedDevice = this.getLastIssuedDevice();
          return this.form.patchValue({
            product: (lastIssuedDevice && !this.device.number) ? lastIssuedDevice : this.devices[0],
            branch: (lastIssuedDevice && !this.device.branch) ? lastIssuedDevice.branch : this.device.branch,
          });
        }
        if (_device.id) {
          this.form.get('name').setValue(_device.name);
        }
      });
    super.ngOnInit();
    this.markForCheck();
  }

  private getLastIssuedDevice() {
    if (this.devices.length > 0) {
      return this.devices.reduce((lastDevice, currentDevice) => {
        return (lastDevice.dateOfIssue > currentDevice.dateOfIssue || !currentDevice.dateOfIssue) ? lastDevice : currentDevice;
      });
    }
    return null;
  }

  markForCheck() {
    this.cdr.markForCheck();
  }
}
