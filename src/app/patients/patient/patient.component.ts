import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '@common/models/contact';
import { PatientVisitsComponent } from '@modules/patients/patient/patient-visits/patient-visits.component';

@Component({
  selector: 'sl-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.less'],
})
export class PatientComponent implements OnInit {
  @ViewChild(PatientVisitsComponent) visitComponent: PatientComponent;
  public contact: Contact;
  public scrollContainerHeader;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.contact = this.route.snapshot.data.contact;
  }

  ngOnInit() {
    this.scrollContainerHeader = document.querySelector('.sl-root-layout .sl-root-container');
  }
}
