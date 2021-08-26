import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FilesService } from '@common/services/file.service';

@Injectable()
export class XrayPhotoResolverService implements Resolve<Blob> {
  constructor(private filesServece: FilesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Blob> {
    return (route.params.id) ? this.filesServece.getTempImageURI(route.params.id) : null;
  }
}

