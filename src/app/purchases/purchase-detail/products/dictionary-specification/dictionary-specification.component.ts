import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { SpecificationService } from '@common/services/specification.service';
import { Specification } from '@common/models/specification';
import { InfinityTable } from '@common/helpers/infinity-table';
import { LocalStorage } from '@common/services/storage';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';

const STORAGE_KEY = '';

@Component({
  templateUrl: './dictionary-specification.component.html',
  styleUrls: ['./dictionary-specification.component.less'],
})
export class DictionarySpecificationComponent extends InfinityTable implements OnInit {
  specificationList: Specification[];

  @ViewChild('nzTable') nzTable;
  public scrollContainer;

  additionalFilterParams = [];

  constructor(
    public tableDataService: SpecificationService,
    public storageService: LocalStorage,
    private toastsService: ToastsService,
    private modal: NzModalRef,
  ) {
    super(
      {},
      STORAGE_KEY,
      storageService,
    );
    this.getData();
  }

  getData(more?) {
    if (this.pending && more) {
      return;
    }
    this.pending = !more;
    this
      .tableDataService
      .getDictionary(
        { code: null },
        { page: more ? this.pagination.page + 1 : 0, pageSize: 10 },
      )
      .subscribe(
        response => this.updatePaginationState(response),
        error => this.onError(error),
        () => this.pending = false,
      );
  }

  ngOnInit() {
    setTimeout(() => {
      this.scrollContainer = this.nzTable.tableBodyElement.nativeElement;
    });
  }

  onError(response: HttpErrorResponse) {
    this.pending = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

  selectSpecification(item) {
    this.modal.destroy(item);
  }
}
