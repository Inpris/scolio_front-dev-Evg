import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationParams } from '@common/services/paginable';
import { SearchUtils } from '@common/utils/search';
import { Robot } from '@common/interfaces/Robot';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { RobotStage, RobotStagesResponse } from '@common/interfaces/Robot-stage';
import { Observable } from 'rxjs/Observable';

enum RobotEndpoints {
  Corset = 'corset',
  Swosh = 'swosh',
  Apparatus = 'apparat',
  Tutor = 'tutor',
}

@Injectable()
export class RobotService extends PaginableService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getList(paginationParams: PaginationParams, params?: any) {
    let searchParams = {};
    if (paginationParams && paginationParams.searchTerm) {
      const { searchTerm = '' } = paginationParams;
      searchParams = SearchUtils.extractName(searchTerm);
    }

    searchParams['sortBy'] = params['sortBy'];
    searchParams['sortType'] = params['sortType'] === 'descend' ? 'DESC' : 'ASC';
    searchParams['PatientFio'] = params['patientFio'];
    searchParams['VisitDate'] = params['visitDate'];
    searchParams['DateOfIssue'] = params['dateOfIssue'];
    searchParams['DateSendingToBranch'] = params['dateSendingToBranch'];
    searchParams['BranchName'] = params['branchName'];
    searchParams['AcceptedBy'] = params['acceptedBy'];
    searchParams['ProductTypeSysName'] = params['ProductTypeSysName'];
    searchParams['MakingStage'] = params['MakingStage'];
    searchParams['DateFrom'] = params['DateFrom'];
    searchParams['DateTo'] = params['DateTo'];

    return this.paginationRequest<Robot>('/api/v1/robot', paginationParams, searchParams);
  }

  update(type: ProductOrderTypes, data) {
    return this.http.put(`/api/v1/robot/${RobotEndpoints[type]}`, data);
  }

  getDiagram(dateParams?: any): Observable<RobotStagesResponse> {
    let paramsRequest = {};
    if (dateParams) {
      paramsRequest = {
        params: dateParams,
      };
    }
    return this.http.get<RobotStagesResponse>('/api/v1/robot/diagram', paramsRequest);
  }

  updateSettings(data) {
    return this.http.put('/api/v1.0/robot/save-diagram-settings', data);
  }

  getRobot(robotId: string): Observable<Robot> {
    return this.http.get<Robot>(`/api/v1.0/robot/${robotId}`);
  }
}
