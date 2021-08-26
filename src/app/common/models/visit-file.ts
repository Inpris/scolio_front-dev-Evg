import { CommonFile } from '@common/models/common-file';

export class VisitFile extends CommonFile {
  get contentURI() {
    return `/api/v1/files/${this.attachmentId}`;
  }
}
