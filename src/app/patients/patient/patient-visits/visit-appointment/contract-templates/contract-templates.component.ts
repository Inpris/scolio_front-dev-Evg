import { Component, Input } from '@angular/core';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { ContractsService } from '@common/services/contracts.service';

@Component({
  selector: 'sl-contract-templates',
  templateUrl: './contract-templates.component.html',
  styleUrls: ['./contract-templates.component.less'],
})
export class ContractTemplatesComponent {

  @Input()
  visitsManager: VisitsManager;

  public templates = [];
  constructor(public contractsService: ContractsService) {}
}
