
import { ProductResponse } from '@common/interfaces/Product-response';
import { AppointmentResponse } from '@common/models/appointment';
import { ContactResponse } from '@common/models/contact';
import { AssignedUser } from './Assigned-user';

export interface PatientResponse  {
  appointment: AppointmentResponse[];
  contact: ContactResponse;
  isDeleted: boolean;
  purchaseDevices: ProductResponse[];
  registryDate: string;
  isCanceled: boolean;
  createdDate: string;
  createdBy: AssignedUser;
  lastModifiedDate: string;
  lastModifiedBy: AssignedUser;
}
