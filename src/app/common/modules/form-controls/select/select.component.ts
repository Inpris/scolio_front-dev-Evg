import { AfterViewInit, Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SelectService } from '@common/modules/form-controls/models/select-service';
import { PaginationParams } from '@common/services/paginable';
import { SelectOption } from '@common/modules/form-controls/models/select-option';
import { NzSelectComponent } from 'ng-zorro-antd';

enum LOADING_STATE {
  LOADING,
  LOADING_NEXT,
  LOADED,
}

const FIRST_PAGE = 1;
const INPUT_DEBOUNCE_TIME = 500;

@Component({
  selector: 'sl-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: SelectComponent, multi: true },
  ],
})
export class SelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input()
  title: string;
  @Input()
  service: SelectService;
  @Input()
  pageParams: PaginationParams = {};
  @Input()
  serverSearch = false;
  @Input()
  options: SelectOption[] = [];
  @Input()
  valueField: string;
  @Input()
  labelField: string;
  @Input()
  disabled: boolean;
  @Input()
  size;
  @Input()
  allowClear = true;
  @Input()
  showTitle = false;
  @Input()
  isShowTooltip = false;
  @Input()
  multi = false;

  public value;

  @ViewChild('selectComponent') selectComponent: NzSelectComponent;

  public totalOptionsCount = 0;
  private searchChange$ = new BehaviorSubject<string>('');
  private loadingState = LOADING_STATE.LOADED;

  public set isLoading(value) {
    this.loadingState = value ? LOADING_STATE.LOADING : LOADING_STATE.LOADED;
    this.cdr.markForCheck();
  }

  public get isLoading() {
    return this.loadingState === LOADING_STATE.LOADING;
  }

  public get canLoadNext() {
    return this.totalOptionsCount > this.options.length &&
      this.loadingState === LOADING_STATE.LOADED;
  }

  private onChange: (_) => void;

  @Input()
  dataFactory: (data: any) => SelectOption[] = data => data

  public registerOnChange = onChange => this.onChange = onChange;
  public registerOnTouched = () => void 0;
  public writeValue(value) {
    this.value = value;
    this.cdr.markForCheck();
  }

  constructor(private cdr: ChangeDetectorRef) {
  }

  public loadNext() {
    if (!this.canLoadNext) {
      return;
    }
    this.pageParams.page += 1;
    this.loadingState = LOADING_STATE.LOADING_NEXT;
    this.searchChange$.next(
      this.searchChange$.getValue(),
    );
  }

  public onSearch(value: string) {
    this.isLoading = true;
    this.pageParams.page = FIRST_PAGE;
    this.searchChange$.next(value);
  }

  /*
     Disables default behaviour
     - When search value not empty => any kind of list updates causes scroll to first element
  */
  ngAfterViewInit() {
    if (this.selectComponent.nzOptionContainerComponent) {
      this.selectComponent.nzOptionContainerComponent.updateListOfFilterOption = () => void 0;
    }
  }

  ngOnInit() {
    if (this.service) {
      this.pageParams.page = FIRST_PAGE;
      this.isLoading = true;
      const optionList$: Observable<SelectOption[]> =
        this.searchChange$.asObservable()
          .debounceTime(INPUT_DEBOUNCE_TIME)
          .switchMap(
            name => this.getOptions(name)
              .do(response => this.totalOptionsCount = response.totalCount)
              .map(this.dataFactory),
          );
      optionList$.subscribe((options) => {
        if (this.pageParams.page <= FIRST_PAGE) {
          this.options.splice(0);
        }
        this.options.push(...options);
        this.isLoading = false;
      });
    }
  }

  private getOptions = (name: string = '') => this.service.getList({ filter: name }, this.pageParams);

  public compareWith(val1, val2) {
    if (typeof val1 === 'object' && typeof val2 === 'object' && val1.id && val2.id) {
      return val1.id === val2.id;
    }
    return val1 === val2;
  }
}
