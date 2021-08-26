import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from "@common/services/auth";
import { Observable } from "rxjs";

@Injectable()
export class ReportService {
  constructor(private _http: HttpClient, private _authService: AuthService) {}

  public getColumnsByReport(reportId: number): Observable<IReportColumn[]> {
    return this._http.get<IReportColumn[]>(`/api/v1/contacts/get-columns?reportId=${reportId}`);
  }

  public getTemplates(reportId: number = 1): Observable<IReportTemplate[]> {
    return this._http
      .get<IReportTemplate[]>(`/api/v1/contacts/report-configurations?userId=${this._authService.user.id}&reportId=${reportId}`)
  }

  public addReportConfiguration(data: IReportSaveRequest): Observable<number> {
    const params = {
      ...data,
      userId: this._authService.user.id,
    };

    return this._http.post<number>(`/api/v1/contacts/add-report-configuration`, params);
  }

  public updateReportConfiguration(data: IReportSaveRequest): Observable<number> {
    const params = {
      ...data,
      userId: this._authService.user.id,
    };

    return this._http.put<number>(`/api/v1/contacts/update-report-configuration`, params);
  }

  public removeReportConfiguration(id: number): Observable<void> {
    return this._http.delete<void>(`/api/v1/contacts/remove-report-configuration/${id}`)
  }
}

export interface IReportColumn {
  name: string;
  sysName: string;
}

export interface IReportTemplate {
  id: number;
  templateName: string;
  columns: IReportColumn[];
}

export interface IReportTemplateTableRow {
  id: number;
  templateName: string;
  columns: string[];
}

export interface IReportSaveRequest {
  id?: number;
  templateName: string;
  reportId: 1 | 2;
  columns: string[];
}
