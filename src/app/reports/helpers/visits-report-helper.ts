import { ReportTable } from '@modules/reports/models/report-table';
import { COLUMN_FORMATTER_TYPES } from '@modules/reports/models/column-formatter-types';
import { REPORT_COLUMN_FILTERS } from '@modules/reports/models/column-filters';
import { Injectable } from '@angular/core';
import { RegionService } from '@common/services/region.service';
import { CityService } from '@common/services/city.service';
import { Genders, GenderService } from '@common/services/dictionaries/gender.service';
import { DoctorsService } from '@common/services/doctors';
import { DisabilityGroupsService } from '@common/services/dictionaries/disability-groups.service';
import { Entity } from '@common/interfaces/Entity';
import { VisitReasonsListService } from '@common/services/dictionaries/visit-reasons-list.service';
import { Diagnosis2Service } from '@common/services/dictionaries/diagnosis2.service';
import { Diagnosis1Service } from '@common/services/dictionaries/diagnosis1.service';
import { BooleanStatusesService } from '@common/services/dictionaries/boolean-statuses.service';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types.service';
import { VertebraTypesService } from '@common/services/dictionaries/vertebra-types.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class VisitsReportHelper {
  private doctorServiceWrapper = {
    getList: ({ filter: LastName }, pageParams) => this.doctorService.getList(pageParams, { LastName }),
  };
  private fromPaginationChunk = response => response.data;
  private booleanFormatter = value => value ? 'Да' : 'Нет';

  constructor(
    private regionsService: RegionService,
    private cityService: CityService,
    private genderService: GenderService,
    private visitReasons: VisitReasonsListService,
    private doctorService: DoctorsService,
    private disabilityGroupService: DisabilityGroupsService,
    private diagnosis1Service: Diagnosis1Service,
    private diagnosis2Service: Diagnosis2Service,
    private booleanStatusesService: BooleanStatusesService,
    private productTypesService: ProductTypesByMedicalService,
    private vertebraTypesService: VertebraTypesService,
    private sanitizer: DomSanitizer,
  ) {
  }

  private _columns: any[] = [
    {
      path: '', filterField: 'LastName', width: 120, title: 'Фамилия', stickyLeft: 0, filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: (item) => {
        return `<a href="/patients/${item.contactId}/info" target="_blank">${item.lastName}</a>`;
      },
    },
    { path: 'firstName', filterField: 'FirstName', width: 120, title: 'Имя', stickyLeft: 120, filterType: REPORT_COLUMN_FILTERS.EXACT_STRING },
    { path: 'secondName', filterField: 'SecondName', width: 120, title: 'Отчество', stickyLeft: 240, filterType: REPORT_COLUMN_FILTERS.EXACT_STRING },
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
      filterService: this.genderService,
      filterDataFactory: value => value,
    },
    {
      path: 'birthDate',
      width: 160,
      title: 'Дата рождения',
      filterField: 'BirthDate',
      formatterType: COLUMN_FORMATTER_TYPES.DATE,
      filterType: REPORT_COLUMN_FILTERS.DATE,
    },
    {
      path: 'age',
      width: 120,
      title: 'Возраст',
      filterField: 'Age',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
    },
    {
      path: 'phone',
      width: 120,
      title: 'Телефон',
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      filterField: 'Phone',
    },
    {
      path: 'visitDate',
      width: 160,
      title: 'Дата посещения',
      formatterType: COLUMN_FORMATTER_TYPES.DATE,
      filterType: REPORT_COLUMN_FILTERS.DATE,
      filterField: 'VisitDate',
    },
    {
      path: 'visitReasonName',
      width: 240,
      title: 'Причина посещения',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'VisitReasonId',
      filterService: this.visitReasons,
      filterDataFactory: this.fromPaginationChunk,
      filterMulti: true,
    },
    {
      path: 'doctorName',
      width: 240,
      title: 'Принимающий специалист',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'DoctorId',
      filterService: this.doctorServiceWrapper,
      filterDataFactory: this.fromPaginationChunk,
      filterMulti: true,
    },
    {
      path: 'disabilityGroupName',
      width: 240,
      title: 'Группа инвалидности',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'DisabilityGroupId',
      filterService: this.disabilityGroupService,
      filterDataFactory: this.fromPaginationChunk,
      filterMulti: true,
    },
    {
      path: 'diagnosis1Name',
      width: 240,
      title: 'Диагноз (Тип)',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'Diagnosis1Id',
      filterService: this.diagnosis1Service,
      filterDataFactory: this.fromPaginationChunk,
      filterMulti: true,
    },
    {
      path: 'diagnosis2Name',
      width: 240,
      title: 'Диагноз (Подтип)',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterField: 'Diagnosis2Id',
      filterService: this.diagnosis2Service,
      filterDataFactory: this.fromPaginationChunk,
      filterMulti: true,
    },
    {
      path: 'mkb10Code',
      width: 240,
      title: 'Диагноз основной (Код)',
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      filterField: 'Mkb10Code',
    },
    {
      path: 'mkb10Name',
      width: 260,
      title: 'Диагноз основной (наименование)',
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      filterField: 'Mkb10Name',
    },
    {
      path: 'attendantDiagnosis',
      width: 240,
      title: 'Диагноз дополнительный',
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      filterField: 'AttendantDiagnosis',
    },
    {
      path: 'productNames',
      width: 240,
      title: 'Изделие',
      filterType: REPORT_COLUMN_FILTERS.EXACT_STRING,
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: item => this.sanitizer.bypassSecurityTrustHtml(
        item ? item.split('\n').map((el, i) => `${i + 1}.${el} </br>`).join('') : '',
      ),
      filterField: 'ProductNames',
    },
    {
      path: 'productTypeNames',
      width: 160,
      title: 'Тип изделия',
      filterField: 'ProductTypesId',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: item => this.sanitizer.bypassSecurityTrustHtml(
        item ? item.split('\n').map((el, i) => `${i + 1}.${el} </br>`).join('') : '',
      ),
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.productTypesService,
      filterDataFactory: this.fromPaginationChunk,
      filterMulti: true,
    },
    {
      path: 'visitType',
      width: 240,
      title: 'Тип приема',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: value => value === 'FirstReception' ? 'Первичный' : 'Повторный',
    },
    {
      path: 'isPsycho',
      width: 120,
      title: 'Психолог',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: this.booleanFormatter,
      filterDataFactory: value => value,
      filterField: 'IsPsycho',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.booleanStatusesService,
    },
    {
      path: 'isCorrection',
      width: 120,
      title: 'Коррекция',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: this.booleanFormatter,
      filterDataFactory: value => value,
      filterField: 'IsCorrection',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.booleanStatusesService,
    },
    {
      path: 'isConsultation',
      width: 140,
      title: 'Консультация',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: this.booleanFormatter,
      filterDataFactory: value => value,
      filterField: 'IsConsultation',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.booleanStatusesService,
    },
    {
      path: 'isReplacement',
      width: 120,
      title: 'Замена',
      formatterType: COLUMN_FORMATTER_TYPES.CUSTOM,
      customFormatter: this.booleanFormatter,
      filterDataFactory: value => value,
      filterField: 'IsReplacement',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.booleanStatusesService,
    },
    {
      path: 'pectoralArchAngle',
      width: 240,
      title: 'Дуга верхнегрудная (угол)',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'PectoralArchAngle',
    },
    {
      path: 'thoracicArchAngle',
      width: 240,
      title: 'Дуга грудная (угол)',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'ThoracicArchAngle',
    },
    {
      path: 'thoracolumbarArchAngle',
      width: 240,
      title: 'Дуга грудопоясничная (угол)',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'ThoracolumbarArchAngle',
    },
    {
      path: 'lumbarArcheAngle',
      width: 240,
      title: 'Дуга поясничная (угол)',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'LumbarArcheAngle',
    },
    {
      path: 'pectoralArchBoundary1',
      width: 260,
      title: 'Дуга верхнегрудная (Граница1)',
      filterField: 'PectoralArchBoundary1',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'thoracicArchBoundary1',
      width: 240,
      title: 'Дуга грудная (Граница1)',
      filterField: 'ThoracicArchBoundary1',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'thoracolumbarArchBoundary1',
      width: 260,
      title: 'Дуга грудопоясничная (Граница1)',
      filterField: 'ThoracolumbarArchBoundary1',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'lumbarArcheBoundary1',
      width: 240,
      title: 'Дуга поясничная (Граница1)',
      filterField: 'LumbarArcheBoundary1',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'pectoralArchVertex',
      width: 240,
      title: 'Дуга верхнегрудная (Вершина)',
      filterField: 'PectoralArchVertex',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'thoracicArchVertex',
      width: 240,
      title: 'Дуга грудная (Вершина)',
      filterField: 'ThoracicArchVertex',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'thoracolumbarArchVertex',
      width: 260,
      title: 'Дуга грудопоясничная (Вершина)',
      filterField: 'ThoracolumbarArchVertex',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'lumbarArcheVertex',
      width: 240,
      title: 'Дуга поясничная (Вершина)',
      filterField: 'LumbarArcheVertex',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'pectoralArchBoundary2',
      width: 260,
      title: 'Дуга верхнегрудная (Граница2)',
      filterField: 'PectoralArchBoundary2',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'thoracicArchBoundary2',
      width: 240,
      title: 'Дуга грудная (Граница2)',
      filterField: 'ThoracicArchBoundary2',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'thoracolumbarArchBoundary2',
      width: 260,
      title: 'Дуга грудопоясничная (Граница2)',
      filterField: 'ThoracolumbarArchBoundary2',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'lumbarArcheBoundary2',
      width: 240,
      title: 'Дуга поясничная (Граница2)',
      filterField: 'LumbarArcheBoundary2',
      filterType: REPORT_COLUMN_FILTERS.DICTIONARY,
      filterService: this.vertebraTypesService,
      filterDataFactory: value => value,
      filterMulti: true,
    },
    {
      path: 'pectoralArchRotation',
      width: 240,
      title: 'Дуга верхнегрудная (Ротация)',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'PectoralArchRotation',
    },
    {
      path: 'thoracicArchRotation',
      width: 240,
      title: 'Дуга грудная (Ротация)',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'ThoracicArchRotation',
    },
    {
      path: 'thoracolumbarArchRotation',
      width: 260,
      title: 'Дуга грудопоясничная (Ротация)',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'ThoracolumbarArchRotation',
    },
    {
      path: 'lumbarArcheRotation',
      width: 240,
      title: 'Дуга поясничная (Ротация)',
      filterType: REPORT_COLUMN_FILTERS.NUMBER,
      filterField: 'LumbarArcheRotation',
    },
  ];

  public getTableSchema(columns?: string[]) {
    const lowerColumns = columns && columns.map((c: string) => c.toLowerCase());

    const cols = lowerColumns ? this._columns.filter(c => {
      return lowerColumns.includes(c.path ? c.path.toLowerCase() : c.filterField.toLowerCase());
    }) : this._columns;

    return new ReportTable(cols);
  }
}
