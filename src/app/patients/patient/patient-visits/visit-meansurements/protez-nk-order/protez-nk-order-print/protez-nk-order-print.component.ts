import { ViewEncapsulation, Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Visit } from '@common/models/visit';
import { Contact } from '@common/models/contact';
import { Entity } from '@common/interfaces/Entity';
import { ProthesisNkOrderUpdate } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/prothesis-nk-order-update.interface';

@Component({
  selector: 'sl-protez-nk-order-print',
  templateUrl: './protez-nk-order-print.component.html',
  styleUrls: ['./protez-nk-order-print.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProtezNkOrderPrintComponent implements OnChanges {
  @Input()
  public device: any;
  @Input()
  public visit: Visit;
  @Input()
  public contact: Contact;
  @Input()
  public users: Map<string, string> = new Map();

  public amputationSides = {
    l: 'Левая',
    lr: 'Левая и Правая',
    r: 'Правая',
  };

  public diagnosis: Entity;

  constructor() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.device && changes.device.currentValue) {}
  }
}
