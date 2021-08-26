import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';

@Component({
  selector: 'sl-visit-comment',
  templateUrl: './visit-comment.component.html',
  styleUrls: ['./visit-comment.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(VisitCommentComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitCommentComponent extends FormValueAccessor {
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.form = fb.group({
      comment: [null],
    });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

}
