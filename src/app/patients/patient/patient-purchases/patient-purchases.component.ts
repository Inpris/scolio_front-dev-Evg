import { Component, OnInit } from '@angular/core';
import { PatientService } from '@common/services/patient.service';
import { PatientPurchases } from '@common/interfaces/Patient-purchases';
import { ToastsService } from '@common/services/toasts.service';
import { PurchaseStatusesService } from '@common/services/purchase-statuses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sl-patient-purchases',
  templateUrl: './patient-purchases.component.html',
  styleUrls: ['./patient-purchases.component.less'],
})
export class PatientPurchasesComponent implements OnInit {
  public data: PatientPurchases[];
  public statusColors;
  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private toastsService: ToastsService,
    private purchaseStatusesService: PurchaseStatusesService,
  ) {
    this.statusColors = this.purchaseStatusesService.getColors();
  }

  ngOnInit() {
    const patientId = this.route.snapshot.parent.params.id;
    this.patientService.getPurchases(patientId)
      .subscribe(
        purchases => this.data = purchases,
        err => this.toastsService.onError(err),
      );
  }

}
