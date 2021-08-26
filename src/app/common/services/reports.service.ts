import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface EmployeeReportRequest {
  startDate: string;
  endDate: string;
  productTypeSysName: string;
}

export interface LocksmithReportRequest {
  startDate: string;
  endDate: string;
  employeeFio: string;
  branchId: string;
}

@Injectable()
export class ReportsService {

  constructor(private http: HttpClient) { }

  getLocksmithReport(request: LocksmithReportRequest) {
    return this.http.post('/api/v1.0/reports/locksmith', request, { responseType: 'blob' });
  }

  getDoctorsReport(request: EmployeeReportRequest) {
    return this.http.post('/api/v1.0/reports/rep-doctors', request, { responseType: 'blob' });
  }

  getTechnicsReport(request: EmployeeReportRequest) {
    return this.http.post('/api/v1.0/reports/rep-technics', request, { responseType: 'blob' });
  }

  getEmployeeReport(request: EmployeeReportRequest) {
    return this.http.post('/api/v1.0/reports/employee', request, { responseType: 'blob' });
  }

  getPurchasesTable(request: any) {
    return this.http.post('/api/v1.0/reports/purchases', request, { responseType: 'blob' });
  }
}
