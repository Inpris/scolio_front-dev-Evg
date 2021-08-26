import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '@common/services/auth';
import { VisitsService } from '@common/services/visits';
import { Contact } from '@common/models/contact';

@Component({
  templateUrl: './marlo-modal.component.html',
  styleUrls: ['./marlo-modal.component.less'],
  providers: [],
})
export class MarloModalComponent implements OnInit {
  @Input() public visitId: string;
  @Input() public contact: Contact;

  @ViewChild('iframeprint') public iframeprint;
  @ViewChild('tablePrint') public tablePrint;

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public rows: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  public form: FormGroup = this._fb.group({
    side: [''],
    measures_taken: [''],
    diagonal: [null],
    trc_anter: [null],
    ischium: [null],
    stump: [null],
    ap_al: [null],
    ap_rf: [null],
    ml_add: [null],
    asis: [null],
    anterior: [null],
    ml_infra: [null],
    ml_supra: [null],
    ap: [null],
    ml: [null],
    status: [''],
    interval: [null],
    circumferences_0: [null],
    circumferences_1: [null],
    circumferences_2: [null],
    circumferences_3: [null],
    circumferences_4: [null],
    circumferences_5: [null],
    circumferences_6: [null],
    circumferences_7: [null],
    circumferences_8: [null],
    circumferences_9: [null],
    reduction_0: [null],
    reduction_1: [null],
    reduction_2: [null],
    reduction_3: [null],
    reduction_4: [null],
    reduction_5: [null],
    reduction_6: [null],
    reduction_7: [null],
    reduction_8: [null],
    reduction_9: [null],
  });

  private _id: string;

  public get printSide(): string {
    const side = this.form.get('side').value;

    if (!side) {
      return '-'
    }

    return side === 'л' ? 'Левая' : 'Правая';
  }

  public get measuresTaken(): string {
    const measures = this.form.get('measures_taken').value;

    if (!measures) {
      return '-'
    }

    return measures === 'к' ? 'На кожу' : 'На лайнер';
  }

  constructor(
    private _fb: FormBuilder,
    private _modal: NzModalRef,
    private _visitsService: VisitsService,
    private _authService: AuthService,
  ) {}

  public ngOnInit() {
    this._loadForm();
  }

  public closeForm() {
    this._modal.destroy();
  }

  public save(): void {
    const service = this._id ? this._visitsService.updateMarlo : this._visitsService.saveMarlo;

    service.call(this._visitsService, this.visitId, this.form.value).subscribe();
  }

  public onFrameLoad(): void {
    const cssLink = document.createElement('link');
    const frame: any = this.iframeprint.nativeElement.contentWindow;
    cssLink.href = 'assets/print-marlo.css';
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';

    frame.document.head.appendChild(cssLink);
    frame.document.body.innerHTML = this.tablePrint.nativeElement.innerHTML;
  }

  public print(): void {
    const frame: any = this.iframeprint.nativeElement.contentWindow;
    frame.document.body.innerHTML = this.tablePrint.nativeElement.innerHTML;

    frame.print();
  }

  private _loadForm(): void {
    this._visitsService.getMarlo(this.visitId)
      .pipe(filter(Boolean))
      .subscribe((data: any) => {
        this._id = data.id;
        this.form.patchValue(data);
      });
  }
}
