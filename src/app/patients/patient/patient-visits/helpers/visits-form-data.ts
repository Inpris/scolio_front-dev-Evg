import { Visit } from '@common/models/visit';
import { VisitCreate } from '@common/interfaces/Visit-create';
import { DateUtils } from '@common/utils/date';
import { extract } from '@common/utils/object';
import { FormGroup } from '@angular/forms';
import { MediaFileType } from '@common/models/media-file';
import { ApparatLegMeasurement } from '@common/models/product-order/apparatus-order/apparat-leg-measurement';

export class VisitsFormData {
  static get formSchema() {
    return {
      appointment: [{}],
      healingPlan: [{}],
      iprPrp: [{}],
      stumpVicesVk: [{}],
      diagnosis: [{}],
      info: [{}],
      comment: [{}],
      documents: [{}],
      measurements: [{}],
      corsetMeasurement: [{}],
      prothesisVkMeasurement: [{}],
      prothesisNkMeasurement: [{}],
      apparatLegMeasurement: [{}],
      wearing: [{}],
      attachments: [[]],
      otherFiles: [[]],
    };
  }

  static fromVisit(visit: Visit) {
    console.log(visit)
    return {
      appointment: {
        medicalService: visit.medicalService,
        room: visit.room,
        doctor: visit.doctor,
        dateTimeStart: visit.dateTimeStart,
        dateTimeEnd: visit.dateTimeEnd,
        healingDynamic: visit.healingDynamic,
        visitReason: visit.visitReason,
        acceptXRay: visit.acceptXRay,
        branchId: visit.branchId,
        nextVisitDate: visit.nextVisitDate,
      },
      healingPlan: {
        healingPlan: visit.healingPlan,
      },
      iprPrp: {
        iprPrp: visit.iprPrp,
        iprPrpComment: visit.iprPrpComment,
        iprPrpActualDate: visit.iprPrpActualDate,
      },
      stumpVicesVk: {
        stumpVicesVk: visit.stumpVicesVk,
      },
      diagnosis: {
        diagnosis1: visit.diagnosis1,
        diagnosis2: visit.diagnosis2,
        mkb10: visit.mkb10,
        attendantDiagnosis: visit.attendantDiagnosis,
      },
      info: {
        growth: visit.growth,
        weight: visit.weight,
        disabilityGroup: visit.disabilityGroup,
        complaints: visit.complaints,
        anamnesis: visit.anamnesis,
        footSize: visit.footSize,
        amputationSide: visit.amputationSide,
      },
      comment: { comment: visit.comment },
      documents: { files: [] },
      measurements: { measurements: visit.measurements },
      corsetMeasurement: visit.corsetMeasurement,
      prothesisVkMeasurement: visit.prothesisVkMeasurement,
      prothesisNkMeasurement: visit.prothesisNkMeasurement,
      apparatLegMeasurement: visit.apparatLegMeasurement,
      wearing: {
        actualCorsetWearing: visit.actualCorsetWearing,
        recommendedCorsetWearing: visit.recommendedCorsetWearing,
      },
      attachments: visit.attachments,
      otherFiles: visit.otherFiles,
    };
  }

  static toVisitCreate(form: FormGroup): VisitCreate {
    const visit = {
      ...form.value.appointment,
      ...form.value.healingPlan,
      ...form.value.iprPrp,
      ...form.value.stumpVicesVk,
      ...form.value.diagnosis,
      ...form.value.info,
      ...form.value.comment,
      ...form.value.documents,
      ...form.value.measurements,
      ...form.value.wearing,
      corsetMeasurement: form.value.corsetMeasurement,
      prothesisVkMeasurement: form.value.prothesisVkMeasurement,
      prothesisNkMeasurement: form.value.prothesisNkMeasurement,
      apparatLegMeasurement: form.value.apparatLegMeasurement,
    } as Visit;
    return {
      medicalServiceId: extract(visit, 'medicalService.id'),
      visitReasonId: extract(visit, 'visitReason.id'),
      acceptXRay: extract(visit, 'acceptXRay'),
      roomId: extract(visit, 'room.id'),
      healingDynamicId: extract(visit, 'healingDynamic.id'),
      disabilityGroupId: extract(visit, 'disabilityGroup.id'),
      diagnosis1Id: extract(visit, 'diagnosis1.id'),
      diagnosis2Id: extract(visit, 'diagnosis2.id'),
      iprPrpId: extract(visit, 'iprPrp.id'),
      stumpVicesVkId: extract(visit, 'stumpVicesVk.id'),
      mkb10Id: extract(visit, 'mkb10.id'),
      growth: visit.growth,
      weight: visit.weight,
      footSize: visit.footSize,
      amputationSide: visit.amputationSide,
      complaints: visit.complaints,
      comment: visit.comment,
      recommendedCorsetWearing: visit.recommendedCorsetWearing,
      actualCorsetWearing: visit.actualCorsetWearing,
      measurements: visit.measurements,
      doctorId: extract(visit, 'doctor.id'),
      dateTimeStart: visit.dateTimeStart && DateUtils.toISODateTimeString(visit.dateTimeStart),
      dateTimeEnd: visit.dateTimeEnd && DateUtils.toISODateTimeString(visit.dateTimeEnd),
      anamnesis: visit.anamnesis,
      healingPlan: visit.healingPlan,
      attendantDiagnosis: visit.attendantDiagnosis,
      iprPrpComment: visit.iprPrpComment,
      iprPrpActualDate: visit.iprPrpActualDate,
      corsetMeasurement: visit.medicalService.sysName === 'Corset' || visit.medicalService.sysName === 'Apparatus'
        ? { ...visit.corsetMeasurement, acceptedBy: extract(visit, 'corsetMeasurement.acceptedBy.id') }
        : null,
      apparatLegMeasurement: visit.medicalService.sysName === 'Tutor' || visit.medicalService.sysName === 'Apparatus'
        ? { ...visit.apparatLegMeasurement, acceptedBy: extract(visit, 'apparatLegMeasurement.acceptedBy.id') }
        : null,
      prothesisVkMeasurement: visit.medicalService.sysName === 'ProtezVK'
        ? { ...visit.prothesisVkMeasurement, acceptedBy: extract(visit, 'prothesisVkMeasurement.acceptedBy.id') }
        : null,
      prothesisNkMeasurement: visit.medicalService.sysName === 'ProtezNK'
          ? { ...visit.prothesisNkMeasurement, acceptedBy: extract(visit, 'prothesisNkMeasurement.acceptedBy.id') }
          : null,
    };
  }
}
