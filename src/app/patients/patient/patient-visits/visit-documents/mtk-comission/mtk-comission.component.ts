import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { StringCustomValidators } from '@common/validators/string-custom-valid';

@Component({
  selector: 'sl-mtk-comission',
  templateUrl: './mtk-comission.component.html',
  styleUrls: ['./mtk-comission.component.less'],
})
export class MtkComissionComponent {
  @Input()
  form;
  public contentTemplate = this.getTemplate('<b>', '</b>');
  public emptyTemplate = { id: null };

  @Input()
  set templates(value) {
    if (!value) { return; }
    this._templates = value;
    if (this.preselect) {
      [this.selectedTemplate = this.emptyTemplate] = value ;
      this.templateHasSelected(this.selectedTemplate);
    }
  }

  public _templates = [];
  public selectedTemplate;

  @Input()
  readonly;

  @Output()
  templateSelected = new EventEmitter();

  @Input()
  preselect = true;

  get comissionMembers() {
    return this.form.get('comissionMembers') as FormArray;
  }

  set comissionMembers(values) {
    this.form.controls['comissionMembers'] = this.fb.array((values as any).map(
      ({ fio, position }) => this.fb.group({
        fio: [fio, StringCustomValidators.required],
        position: [position, StringCustomValidators.required],
      })));
  }

  constructor(private fb: FormBuilder) {
  }

  getTemplate(prefix = '', suffix = '') {
    return `Мы, нижеподписавшиеся, ${prefix}$председатель$${suffix} и члены комиссии, ${prefix}$члены_комиссии$${suffix }`;
  }

  pasteTemplate() {
    this.form.patchValue({ content: this.getTemplate() });
  }

  addComissionMember() {
    (<FormArray>this.form.controls.comissionMembers).push(this.fb.group({
      fio: [null, StringCustomValidators.required],
      position: [null, StringCustomValidators.required],
    }));
  }


  templateHasSelected({
                        name = null,
                        comissionChairman = {
                          fio: null,
                          position: null,
                        },
                        comissionMembers = [],
                        content = null,
                      }) {
    this.form.patchValue({
      name,
      comissionChairman,
      content,
    });
    this.comissionMembers = comissionMembers as any;
    this.templateSelected.emit(this.selectedTemplate);
  }

  removeComissonMember(index) {
    (<FormArray>this.form.controls.comissionMembers).removeAt(index);
  }

}
