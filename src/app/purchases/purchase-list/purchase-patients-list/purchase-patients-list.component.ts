import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '@common/services/patient.service';
import { Patient } from '@common/models/patient';

@Component({
  selector: 'sl-purchase-patients-list',
  templateUrl: './purchase-patients-list.component.html',
  styleUrls: ['./purchase-patients-list.component.less'],
})
export class PurchasePatientsListComponent implements OnInit {

  @ViewChild('table')
  table;

  @Input()
  purchaseId: string = null;

  pageParams = {
    totalCount: null,
    page: 1,
    pageSize: 500,
    pageCount: null,
  };
  patients: Patient[];

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    if (this.purchaseId) {
      this.getPatients();
    }
  }

  getPatients() {
    const params = {
      purchaseId: this.purchaseId,
    };

    this.patientService.getList(params, this.pageParams)
      .subscribe((data) => {
        this.patients = data.data;
      });
  }

  expandChange(rowData, state) {
    this.table.data.forEach(data => data.expand = state && rowData.contact.id === data.contact.id);
  }

}
