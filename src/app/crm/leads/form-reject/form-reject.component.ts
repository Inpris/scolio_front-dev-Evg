import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { RejectResultsService } from '@common/services/rejectResults';
import { RejectResults } from '@common/models/rejectResults';
import { FormUtils } from '@common/utils/form';
import { RejectsService } from '@common/services/rejects';
import { Router } from '@angular/router';

@Component({
  selector: 'sl-form-reject',
  templateUrl: './form-reject.component.html',
  styleUrls: ['./form-reject.component.less'],
})
export class FormRejectComponent implements OnInit {
  leadFormLoading = false;
  form: FormGroup;
  services: RejectResults[];
  createData = {
    entityType: 'Lead',
    entityId: '',
    rejectResultId: 'string',
  };

  @Output() closeModal = new EventEmitter<boolean>();

  @Input() lead: string;

  constructor(private rejectResultsService: RejectResultsService, private rejectsService: RejectsService, private router: Router) {
    this.form = new FormGroup({
      comment: new FormControl(''),
      reasonId: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.rejectResultsService.getList().subscribe((services) => { this.services = services; });
    this.createData.entityId = this.lead;
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }

    this.createData.rejectResultId = form.value.reasonId;
    this.leadFormLoading = true;

    this.rejectsService.create(this.createData)
      .finally(() => { this.leadFormLoading = false; })
      .subscribe((response) => {
        this.closeForm();
        this.router.navigate(['/crm']);
      });
  }

  closeForm() {
    this.closeModal.emit(true);
  }

}
