import { ReportTable } from '@modules/reports/models/report-table';
import { COLUMN_FORMATTER_TYPES } from '@modules/reports/models/column-formatter-types';
import { REPORT_COLUMN_FILTERS } from '@modules/reports/models/column-filters';
import { Injectable } from '@angular/core';
import { RegionService } from '@common/services/region.service';
import { CityService } from '@common/services/city.service';
import { Genders, GenderService } from '@common/services/dictionaries/gender.service';
import { DisabilityGroupsService } from '@common/services/dictionaries/disability-groups.service';
import { Entity } from '@common/interfaces/Entity';
import { BooleanStatusesService } from '@common/services/dictionaries/boolean-statuses.service';

@Injectable()
export class PatientsReportHelper {
  private fromPaginationChunk = response => response.data;
  private booleanFormatter = value => value ? 'Да' : 'Нет';

  private _columns = [
    {
      path: '',
      width: 120,
      title: 'Фамилия',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: (item) => {
        return `<a href="/patients/${item.id}/info" target="_blank">${item.lastName}</a>`;
      },
      stickyLeft: 0,
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      filterField: 'LastName',
    },
    {
      path: 'firstName',
      width: 120,
      title: 'Имя',
      stickyLeft: 120,
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      filterField: 'FirstName',
    },
    {
      path: 'secondName',
      width: 120,
      title: 'Отчество',
      stickyLeft: 240,
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      filterField: 'SecondName',
    },
    {
      path: 'regionName',
      width: 120,
      title: 'Регион',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'RegionId',
      filterDataFactory: this.fromPaginationChunk,
      filterService: this.regionsService,
      filterMulti: true,
    },
    {
      path: 'cityName',
      width: 120,
      title: 'Город',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'CityId',
      filterDataFactory: this.fromPaginationChunk,
      filterService: this.cityService,
      filterMulti: true,
    },
    {
      path: 'gender',
      width: 120,
      title: 'Пол',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: value => (Genders[value] || {} as Entity).name,
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'Gender',
      filterDataFactory: value => value,
      filterService: this.genderService,
    },
    {
      path: 'birthDate',
      width: 160,
      title: 'Дата рождения',
      formatterType: COLUMN_FORMATTER_TYPES.DATE,
      filterType: REPORT_COLUMN_FILTERS.DATE,
      filterField: 'BirthDate',
    },
    {
      path: 'age',
      width: 120,
      title: 'Возраст',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'Age',
    },
    {
      path: 'hasInvalidGroup',
      width: 140,
      title: 'Инвалидность',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: this.booleanFormatter,
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'HasInvalidGroup',
      filterDataFactory: value => value,
      filterService: this.booleanStatusesService,
    },
    {
      path: 'disabilityGroupName',
      width: 240,
      title: 'Группа инвалидности',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'DisabilityGroupId',
      filterDataFactory: this.fromPaginationChunk,
      filterService: this.disabilityGroupService,
      filterMulti: true,
    },
    {
      path: 'countOfVisits',
      width: 180,
      title: 'Количество посещений',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'CountOfVisits',
    },
    {
      path: 'lastVisitDate',
      width: 220,
      title: 'Дата последнего посещения',
      formatterType: COLUMN_FORMATTER_TYPES.DATE,
      filterType: REPORT_COLUMN_FILTERS.DATE,
      filterField: 'LastVisitDate',
    },
    {
      path: 'nextVisitDate',
      width: 350,
      title: 'Дата следующего посещения (запись на прием)',
      formatterType: COLUMN_FORMATTER_TYPES.DATE,
      filterType: REPORT_COLUMN_FILTERS.DATE,
      filterField: 'NextVisitDate',
    },
    {
      path: 'phone',
      width: 120,
      title: 'Телефон',
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      filterField: 'Phone',
    },
  ];

  constructor(
    private regionsService: RegionService,
    private cityService: CityService,
    private genderService: GenderService,
    private disabilityGroupService: DisabilityGroupsService,
    private booleanStatusesService: BooleanStatusesService,
  ) {
  }

  public getTableSchema(columns?: string[]) {
    const lowerColumns = columns && columns.map((c: string) => c.toLowerCase());

    const cols = lowerColumns ? this._columns.filter(c => lowerColumns.includes(c.filterField.toLowerCase())) : this._columns;

    return new ReportTable(cols);
  }
}
