import { Visit } from '@common/models/visit';
import { DateUtils } from '@common/utils/date';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MediaFile } from '@common/models/media-file';
import { Measurement } from '@common/interfaces/Measurement';
import { CommonFile } from '@common/models/common-file';

export class VisitsManager {
  public visits: Visit[] = [];
  public visitsRelative: Visit[] = [];
  public selectionChanges = new Subject<Visit>();
  public visitsUpdated = new BehaviorSubject<Visit[]>(this.visits);
  public selectedPhotos = [];
  private selectedIndex = -1;

  constructor(public patientId) {}

  get selected(): Visit {
    return this.visits[this.selectedIndex];
  }

  public select(visit: Visit) {
    this.selectedIndex = this.findIndex(visit);
    this.visitsRelative = this.visits.slice(this.selectedIndex + 1);
    this.selectionChanges.next(this.selected);
    this.selectedPhotos = [];
  }

  private findIndex(visit) {
    return this.visits.findIndex(_visit => _visit === visit);
  }

  public setVisits(_visits: Visit[]) {
    const selected = this.selected;
    this.visits = _visits.sort((visit, visitNext) =>
      +DateUtils.parse(visitNext.dateTime) - +DateUtils.parse(visit.dateTime),
    ) || [];
    this.selectedIndex = this.findIndex(selected);
    this.visitsRelative = this.visits.slice(this.selectedIndex + 1);
    this.visitsUpdated.next(this.visits);
  }

  public append(visit: Visit) {
    this.setVisits([...this.visits, visit]);
  }

  public updateVisit(visit: Visit) {
    Object.assign(this.selected, visit);
    this.visitsUpdated.next(this.visits);
  }

  public updateAttachments(photos: MediaFile[], videos: MediaFile[]) {
    this.selected.photos = photos;
    this.selected.videos = videos;
  }

  public updateMeasurements(measurements: Measurement[]) {
    this.selected.measurements = measurements;
  }

  public updateOthersFiles(othersFiles: CommonFile[]) {
    this.selected.otherFiles = othersFiles;
  }

  public delete(visit: Visit) {
    const index = this.findIndex(visit);
    if (this.selectedIndex === index) {
      this.selectedIndex = -1;
    }
    this.setVisits([...this.visits.slice(0, index), ...this.visits.slice(index + 1)]);
  }

  public togglePhotoSelection(photo: MediaFile) {
    const index = this.selectedPhotos.indexOf(photo);
    this.selectedPhotos = index >= 0
      ? [...this.selectedPhotos.slice(0, index), ...this.selectedPhotos.slice(index + 1)]
      : [...this.selectedPhotos, photo];
  }

  public removePhotosSelection(photos: MediaFile[] = []) {
    for (const photo of photos) {
      photo.selected = false;
      const index = this.selectedPhotos.indexOf(photo);
      if (index >= 0) {
        this.selectedPhotos = [...this.selectedPhotos.slice(0, index), ...this.selectedPhotos.slice(index + 1)];
      }
    }
  }

  public findLatestVisitByType(typeId) {
    const visits = this.visits.filter(visit => visit.medicalService.id === typeId);
    visits.sort((prev, next) => +new Date(next.dateTime) - +new Date(prev.dateTime));
    return visits[0];
  }

  public findLatestVisit() {
    const visits = [...this.visits];
    visits.sort((prev, next) => +new Date(next.dateTime) - +new Date(prev.dateTime));
    return visits[0];
  }

  public getSameDeal(visit: Visit) {
    return this.visits.filter(_visit => _visit.deal.id === visit.deal.id);
  }
}
