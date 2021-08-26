import { COLUMN_FORMATTER_TYPES } from '@modules/reports/models/column-formatter-types';
import { extract } from '@common/utils/object';
import * as moment from 'moment';

export class ReportCell<T extends object> {
  public value: any;
  public formattedValue: any;

  constructor(
    item: T,
    path: string,
    formatterType = COLUMN_FORMATTER_TYPES.DEFAULT,
    customFormatter?: (item: T) => any,
  ) {
    this.value = extract(item, path);
    switch (formatterType) {
      case COLUMN_FORMATTER_TYPES.DEFAULT:
        this.formattedValue = this.value;
        break;
      case COLUMN_FORMATTER_TYPES.CUSTOM:
        this.formattedValue = customFormatter ? customFormatter(this.value) : this.value;
        break;
      case COLUMN_FORMATTER_TYPES.DATE:
        this.formattedValue = this.value ? moment(this.value).format('DD.MM.YYYY') : '';
        break;
    }
  }
}
