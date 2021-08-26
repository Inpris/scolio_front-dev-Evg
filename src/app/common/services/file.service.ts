import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileResponse } from '@common/interfaces/File-response';
import { CommonFile } from '@common/models/common-file';
import { MediaFileType, MediaFile } from '@common/models/media-file';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilesService {
  constructor(private http: HttpClient) {
  }

  get(id: string) {
    const url = `/api/v1/files/${id}`;
    return this.http.get<FileResponse[]>(url)
      .map((files: FileResponse[]) => files.map(file => new CommonFile(file)));
  }

  getTempImageURI(id: string) {
    const url = `/api/v1/files/temp/${id}`;
    return  this.http.get(url, { responseType: 'blob' });
  }

  create(data: string[]) {
    const url = `/api/v1/files`;
    return this.http.post<FileResponse[]>(url, data)
      .map((files: FileResponse[]) => files.map(file => new CommonFile(file)));
  }

  createTemp(file: any) {
    const url = `/api/v1/files/temp`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string>(url, formData)
      .map(tempAttachmentId => new CommonFile({ tempAttachmentId, fileName: file.name }));
  }

  createTempMedia(file: any, type: MediaFileType): Observable<MediaFile> {
    const url = `/api/v1/media/`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<MediaFile>(url, formData)
      .map(response => new MediaFile({ ...response, fileName: file.name }, type));
  }

  delete(id: string) {
    const url = `/api/v1/files/${id}`;
    return this.http.delete<any>(url);
  }

  urlToFile(url: string, filename: string, mimeType: string): Observable<File> {
    const file = new Subject<File>();
    this.http
        .get(url, { responseType: 'blob' })
        .subscribe((response: Blob) => file.next(new File([response], filename, { type: mimeType })));
    return file;
  }

  saveFile(fullName, data, type) {
    const blob = new Blob([data], { type });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fullName);
      return;
    }
    const dataBlob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = dataBlob;
    link.download = fullName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(dataBlob);
    }, 100);
  }
}
