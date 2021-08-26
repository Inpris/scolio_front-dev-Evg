import { Expose } from 'class-transformer';

export class Report {
  id: string;
  @Expose({ groups: ['visit'] })
  contactId: string;
  @Expose({ groups: ['visit'] })
  dealId: string;
  lastName: string;
  firstName: string;
  secondName: string;
  regionId: string;
  regionName: string;
  cityId: string;
  cityName: string;
  gender: string;
  birthDate: string;
  age: string;
  phone: string;
  @Expose({ groups: ['visit'] })
  visitDate: string;
  @Expose({ groups: ['visit'] })
  visitReasonId: string;
  @Expose({ groups: ['visit'] })
  visitReasonName: string;
  @Expose({ groups: ['visit'] })
  doctorId: string;
  @Expose({ groups: ['visit'] })
  doctorName: string;
  disabilityGroupId: string;
  disabilityGroupName: string;
  @Expose({ groups: ['visit'] })
  diagnosis1Id: string;
  @Expose({ groups: ['visit'] })
  diagnosis1Name: string;
  @Expose({ groups: ['visit'] })
  diagnosis2Id: string;
  @Expose({ groups: ['visit'] })
  diagnosis2Name: string;
  @Expose({ groups: ['visit'] })
  attendantDiagnosis: string;
  @Expose({ groups: ['visit'] })
  mkb10Code: string;
  @Expose({ groups: ['visit'] })
  mkb10Name: string;
  @Expose({ groups: ['visit'] })
  productNames: string;
  @Expose({ groups: ['visit'] })
  productTypeNames: string[];
  @Expose({ groups: ['visit'] })
  productTypeIds: string[];
  @Expose({ groups: ['visit'] })
  visitType: string;
  @Expose({ groups: ['visit'] })
  isPsycho: string;
  @Expose({ groups: ['visit'] })
  isCorrection: string;
  @Expose({ groups: ['visit'] })
  isConsultation: string;
  @Expose({ groups: ['visit'] })
  isReplacement: string;
  @Expose({ groups: ['visit'] })
  pectoralArchAngle: string;
  @Expose({ groups: ['visit'] })
  thoracicArchAngle: string;
  @Expose({ groups: ['visit'] })
  thoracolumbarArchAngle: string;
  @Expose({ groups: ['visit'] })
  lumbarArcheAngle: string;
  @Expose({ groups: ['visit'] })
  pectoralArchBoundary1: string;
  @Expose({ groups: ['visit'] })
  thoracicArchBoundary1: string;
  @Expose({ groups: ['visit'] })
  thoracolumbarArchBoundary1: string;
  @Expose({ groups: ['visit'] })
  lumbarArcheBoundary1: string;
  @Expose({ groups: ['visit'] })
  pectoralArchRotation: string;
  @Expose({ groups: ['visit'] })
  thoracicArchRotation: string;
  @Expose({ groups: ['visit'] })
  thoracolumbarArchRotation: string;
  @Expose({ groups: ['visit'] })
  lumbarArcheRotation: string;
  @Expose({ groups: ['visit'] })
  pectoralArchVertex: string;
  @Expose({ groups: ['visit'] })
  thoracicArchVertex: string;
  @Expose({ groups: ['visit'] })
  thoracolumbarArchVertex: string;
  @Expose({ groups: ['visit'] })
  lumbarArcheVertex: string;
  @Expose({ groups: ['visit'] })
  pectoralArchBoundary2: string;
  @Expose({ groups: ['visit'] })
  thoracicArchBoundary2: string;
  @Expose({ groups: ['visit'] })
  thoracolumbarArchBoundary2: string;
  @Expose({ groups: ['visit'] })
  lumbarArcheBoundary2: string;
  @Expose({ groups: ['contact'] })
  hasInvalidGroup: string;
  @Expose({ groups: ['contact'] })
  countOfVisits: string;
  @Expose({ groups: ['contact'] })
  lastVisitDate: string;
  @Expose({ groups: ['contact'] })
  nextVisitDate: string;
}
