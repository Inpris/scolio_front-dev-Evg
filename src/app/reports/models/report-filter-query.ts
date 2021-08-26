export class ReportFilterQuery {
  constructor(
    public operator: string,
    public value: any,
  ) {
  }
}

export class ReportFilterValue {
  constructor(
    public queries: ReportFilterQuery[],
    public extra?: any,
  ) {
  }
}

export enum REPORT_FILTER_OPERATOR {
  EQ = 'eq',
  NEQ = 'neq',
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  ICONTAINS = 'icontains',
  STARTSWITH = 'startswith',
  ENDSWITH = 'endswith',
}

export enum REPORT_QUERY_TYPES {
  FROM,
  TO,
  EXACT,
  RANGE,
  CURRENT_MONTH,
}
