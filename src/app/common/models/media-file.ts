export enum MediaFileType {
  UNKNOWN,
  PHOTO,
  VIDEO,
}

export const MediaFileMimeTypes = {
  photo: ['image/png', 'image/jpeg'],
  video: ['video/mp4'],
};

export const MedaiFileExtensions = {
  photo: ['.jpeg', '.png'],
  video: ['.mp4'],
};

export class MediaFile {
  id: string;
  fileName: string;
  selected = false;
  thumbnail = {
    attachmentId: undefined,
    tempAttachmentId: undefined,
  };

  content = {
    attachmentId: undefined,
    tempAttachmentId: undefined,
  };

  get isTemp() {
    return !Boolean(this.id);
  }

  get thumbnailURI() {
    return `/api/v1/files/${
      this.isTemp
        ? 'temp/' + this.thumbnail.tempAttachmentId
        : this.thumbnail.attachmentId
      }`;
  }

  get contentURI() {
    return `/api/v1/files/${
      this.isTemp
        ? 'temp/' + this.content.tempAttachmentId
        : this.content.attachmentId
      }`;
  }

  constructor(data: any, public type: MediaFileType) {
    this.thumbnail.attachmentId = data.thumbnailId;
    this.thumbnail.tempAttachmentId = data.tempThumbnailId;
    this.content.attachmentId = data.contentAttachmentId;
    this.content.tempAttachmentId = data.tempContentId;
    this.id = data.id;
    this.fileName = data.fileName;
  }

  static getType(mimeType) {
    if (MediaFileMimeTypes.photo.indexOf(mimeType) >= 0) {
      return MediaFileType.PHOTO;
    }
    if (MediaFileMimeTypes.video.indexOf(mimeType) >= 0) {
      return MediaFileType.VIDEO;
    }
    return MediaFileType.UNKNOWN;
  }

  static getAllowedTypes() {
    return [...MedaiFileExtensions.photo, ...MedaiFileExtensions.video, ...MediaFileMimeTypes.photo, ...MediaFileMimeTypes.video];
  }
}
