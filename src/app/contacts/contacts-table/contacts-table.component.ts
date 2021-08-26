import { Component, ContentChild, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ContactsService } from '@common/services/contacts';
import { PageParams } from '@common/interfaces/Page-params';
import { InfinityScrollComponent } from '@common/modules/infinity-scroll/infinity-scroll/infinity-scroll.component';

@Component({
  selector: 'sl-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.less'],
})
export class ContactsTableComponent implements OnInit, OnChanges {

  @ContentChild('header') templateHead: TemplateRef<ElementRef>;
  @ContentChild('body') templateBody: TemplateRef<ElementRef>;
  @ContentChild('expand') templateExpand: TemplateRef<ElementRef>;

  @ViewChild('infinityScroll') infinityScroll: InfinityScrollComponent;

  @Input()
  filter;

  @Input()
  sort: { sortBy, sortType };

  @Input()
  contactTypeSysNames: string[];

  public data;
  public pending = true;
  public pagination: PageParams;
  public scrollContainer;

  constructor(
    private contactsService: ContactsService,
  ) {
  }

  ngOnInit() {
    this.scrollContainer = document.querySelector('.sl-root-layout .sl-root-container');
    this.getContacts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter && !changes.filter.firstChange || changes.sort && !changes.sort.firstChange) {
      this.getContacts();
    }
  }

  getContacts(more?) {
    if (this.pending && more) {
      return;
    }
    this.pending = !more;
    this.contactsService
      .getTableList(
        { page: more ? this.pagination.page + 1 : 0, pageSize: 10 },
        { ...this.filter, ...this.sort, contactTypeSysNames: this.contactTypeSysNames },
      )
      .subscribe(
        response => this.updatePaginationState(response),
        () => void 0,
        () => this.pending = false,
      );
  }

  updatePaginationState({ data, page, pageSize, pageCount, totalCount }) {
    this.data = [...page === 1 || this.data === undefined ? [] : this.data, ...data];
    this.pagination = { page, pageCount, pageSize, totalCount };
    this.pending = false;
    setTimeout(() => {
      if (this.infinityScroll !== undefined) {
        this.infinityScroll.checkView();
      }
    });
  }

}
