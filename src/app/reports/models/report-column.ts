export interface ReportColumn {
  path: string;
  formatterType?;
  customFormatter?(item): any;
}
