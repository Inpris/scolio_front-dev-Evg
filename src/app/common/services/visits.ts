import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { Visit } from '@common/models/visit';
import { VisitResponse } from '@common/interfaces/Visit-response';
import { VisitCreate } from '@common/interfaces/Visit-create';
import { MediaFile, MediaFileType } from '@common/models/media-file';
import { Observable } from 'rxjs/Observable';
import { Measurement } from '@common/interfaces/Measurement';
import { CommonFile } from '@common/models/common-file';
import { FileResponse } from '@common/interfaces/File-response';
import { VisitFile } from '@common/models/visit-file';

export { Visit };

@Injectable()
export class VisitsService extends PaginableService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getList(contactId: string, paginationParams: PaginationParams = {}) {
    return this.paginationRequest<VisitResponse>('/api/v1/visits', paginationParams, { contactId })
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(visit => new Visit(visit)),
        } as PaginationChunk<Visit>;
      });
  }

  update(visitId: string, visit: VisitCreate) {
    return this.http.put<VisitResponse>(`/api/v1/visits/${visitId}`, visit)
      .map(_visit => new Visit(_visit));
  }

  create(visit: VisitCreate) {
    return this.http.post<VisitResponse>('/api/v1/visits', visit)
      .map(_visit => new Visit(_visit));
  }

  delete(visitId: string) {
    return this.http.delete<VisitResponse>(`/api/v1/visits/${visitId}`);
  }

  get(visitId: string) {
    return this.http.get<VisitResponse>(`/api/v1/visits/${visitId}`)
      .map(_visit => new Visit(_visit));
  }

  createPhoto(visitId: string, tempFile: MediaFile) {
    return this.http.post<FileResponse>('/api/v1/visits/photo', tempFile, { params: { visitId } })
      .map(photo => new MediaFile(photo, MediaFileType.PHOTO));
  }

  createVideo(visitId: string, tempFile: MediaFile) {
    return this.http.post<FileResponse>('/api/v1/visits/video', tempFile, { params: { visitId } })
      .map(photo => new MediaFile(photo, MediaFileType.VIDEO));
  }

  createFile(visitId: string, tempFile: CommonFile) {
    return this.http.post<FileResponse>('/api/v1/visits/file', tempFile, { params: { visitId } })
     .map(photo => new VisitFile(photo));
  }

  deletePhoto(photoId: string) {
    return this.http.delete<FileResponse>(`/api/v1/visits/photo/${photoId}`);
  }

  deleteVideo(videoId: string) {
    return this.http.delete<FileResponse>(`/api/v1/visits/video/${videoId}`);
  }

  deleteFile(fileId: string) {
    return this.http.delete<FileResponse>(`/api/v1/visits/file/${fileId}`);
  }

  updateMeasurements(visitId: string, measurements: Measurement[]): Observable<Measurement[]> {
    return this.http.put<Measurement[]>(`/api/v1/visits/xray/${visitId}`, measurements);
  }

  public getMarlo(visitId: string): Observable<any> {
    return this.http.get<any>(`/api/v1/visits/marlo/${visitId}`);
  }

  public saveMarlo(visitId: string, data: any): Observable<any> {
    return this.http.post<any>(`/api/v1/visits/marlo/${visitId}`, data);
  }

  public updateMarlo(visitId: string, data: any): Observable<any> {
    return this.http.put<any>(`/api/v1/visits/marlo/${visitId}`, data);
  }
}
