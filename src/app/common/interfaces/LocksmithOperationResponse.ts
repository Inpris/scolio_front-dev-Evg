export interface LocksmithOperationResponse {
  executor: {
    id: string;
    name: string;
  };
  name: string;
  start: string;
  end: string;
  edit: boolean;
  createdBy: {
    id: string;
    name: string;
  };
  createdDate: string;
  lastModifiedBy: {
    id: string;
    name: string;
  };
  lastModifiedDate: string;
  id: string;
}
