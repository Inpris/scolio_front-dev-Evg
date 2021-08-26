import { PatientResponse } from '@common/interfaces/Patient-response';
import { Appointment } from '@common/models/appointment';
import { Product } from '@common/models/product';
import { Contact } from '@common/models/contact';
import { AssignedUser } from '@common/interfaces/Assigned-user';

export class Patient {
  appointment: Appointment[];
  contact: Contact;
  isDeleted: boolean;
  purchaseDevices: Product[];
  registryDate: string;
  isCanceled: boolean;
  createdDate: string;
  createdBy: AssignedUser;
  lastModifiedDate: string;
  lastModifiedBy: AssignedUser;

  constructor(data: PatientResponse) {
    this.appointment = data.appointment ? data.appointment.map(item => new Appointment(item)) : null;
    this.purchaseDevices = data.purchaseDevices ? data.purchaseDevices.map(item => new Product(item)) : null;
    this.isDeleted = data.isDeleted;
    this.contact = new Contact(data.contact);
    this.registryDate = data.registryDate;
    this.isCanceled = data.isCanceled;
    this.createdDate = data.createdDate;
    this.createdBy = data.createdBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.lastModifiedBy = data.lastModifiedBy;
  }
}
