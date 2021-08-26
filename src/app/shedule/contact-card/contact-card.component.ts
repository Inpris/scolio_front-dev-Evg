import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { Contact } from '@common/models/contact';
import { Visit, VisitsService } from '@common/services/visits';
import { ContactTypeSysNames } from '@common/models/contact-types';
import {AccessesService} from "@common/services/accesses-service.service";
import {AccessesDataService} from "@common/services/accesses-data.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {MAIN_BRANCH} from "@common/constants/access-roles-to-the-path.constant";

@Component({
  selector: 'sl-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.less'],
  providers: [
    AccessesService,
  ]
})
export class ContactCardComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  contact: Contact;

  @Input()
  branchId: string;

  @Input()
  hasCome: boolean;

  private page: number;

  public hasMore = false;
  public contactCardLoading = false;
  public isPatient;
  public access: boolean;
  public visits: Visit[];
  public isKilled$ = new Subject();

  constructor(
    private visitsService: VisitsService,
    private accessesService: AccessesService,
    private accessesDataService: AccessesDataService
  ) {}

  public get recordsInfo(): boolean {
    return this.access && !this.isMainBranch && this.contact && this.contact.isVirtual;
  }

  public get unConfirm(): boolean {
    return this.contact && !this.access;
  }

  public get showInfo(): boolean {
    return (this.access || this.isMainBranch) && this.contact && !this.contact.isVirtual;
  }

  get isMainBranch() {
    return this.branchId === MAIN_BRANCH;
  }

  public collapseSiblings(state, visit) {
    if (!state) { return; }
    this.visits.forEach((_visit) => {
      if (visit !== _visit) {
        _visit['active'] = false;
      }
    });
  }

  public ngOnInit(): void {
    this.accessesDataService.isAccess
      .pipe(
        takeUntil(this.isKilled$)
      )
      .subscribe((access: boolean) => {
        this.access = access;
      })
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.contact && changes.contact.currentValue) {
      if (changes.contact.currentValue.id && this.branchId && !this.isMainBranch) {
        this.accessesService.isAccess(this.branchId, changes.contact.currentValue.id)
          .subscribe((isAccess: boolean) => {
            this.accessesDataService.isAccess.next(isAccess);
          });
      }

      this.visits = [];
      this.page = 1;
      this.hasMore = false;
      if (this.contact != null) {
        this.isPatient = Array.isArray(this.contact.contactTypes)
          && this.contact.contactTypes.some(
            contactType => contactType.sysName === ContactTypeSysNames.PATIENT,
          );
        this.fetchVisits(this.page);
      }
    }

    if (changes.branchId) {
      this.contact = null;
    }
  }

  public ngOnDestroy(): void {
    this.isKilled$.next();
    this.isKilled$.complete();
  }

  public loadMoreVisits() {
    this.fetchVisits(this.page + 1);
  }

  private fetchVisits(page: number = 1) {
    this.contactCardLoading = true;
    return this.visitsService.getList(this.contact.id, { page, pageSize: 4 })
      .finally(() => { this.contactCardLoading = false; })
      .subscribe((response) => {
        this.page = page;
        this.visits.push(...response.data);
        this.hasMore = response.page < response.pageCount;
      });
  }
}
