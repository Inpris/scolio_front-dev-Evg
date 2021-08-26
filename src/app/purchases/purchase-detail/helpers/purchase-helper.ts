import { DateUtils } from '@common/utils/date';
import { Purchase } from '@common/models/purchase';
import { PurchaseUpdate } from '@common/interfaces/Purchase-update';
import { DocumentResponse } from '@common/interfaces/Document-response';
import { DocumentCreate } from '@common/interfaces/Document-create';
const transformDate = date => date ? DateUtils.toISODateTimeString(date) : null;

export class PurchaseHelper {
  static getPurchaseModel(updatedState: Purchase): PurchaseUpdate {
    const {
      purchaseStatus,
      noticeNumber,
      purchaseType,
      contractNumber,
      tenderPlatform,
      purchaseUrl,
      purchaseCode,
      registryNumber,
      serviceDeliveryDate,
      serviceDeliveryPlace,
      purchaseObject,
      deadline,
      startMaxContractPrice,
      contractPriceDeclineSum,
      contractPriceDeclinePercent,
      bidDateTimeEnd,
      bidReviewDateTimeEnd,
      auctionDate,
      auctionDateLocal,
      finalContractPrice,
      contractProvision,
      paymentOrderNumber,
      paymentDate,
      returnDate,
      returnProvisionNotificationDate,
      isReturnProvision,
      organizationRequisites,
      customer,
      responsible,
      note,
      includeResidenceCompensationMaxDays,
      includeResidenceCompensationMaxSum,
      includeResidenceCompensationSum,
      contractDate,
      contractCompleteDate,
      isWin,
      penalties,
      changeStatusDateTime,
      patients,
      contractExecutionDate,
      files,
      purchaseChapters,
      documents,
    } = updatedState;

    return {
      noticeNumber,
      contractNumber,
      purchaseUrl,
      purchaseCode,
      registryNumber,
      serviceDeliveryPlace,
      purchaseObject,
      startMaxContractPrice,
      contractPriceDeclineSum,
      contractPriceDeclinePercent,
      finalContractPrice,
      contractProvision,
      paymentOrderNumber,
      isReturnProvision,
      organizationRequisites,
      responsible,
      note,
      includeResidenceCompensationMaxDays,
      includeResidenceCompensationMaxSum,
      includeResidenceCompensationSum,
      isWin,
      penalties,
      patients,
      serviceDeliveryDate,
      deadline: transformDate(deadline),
      auctionDateLocal: transformDate(auctionDateLocal),
      paymentDate: transformDate(paymentDate),
      returnDate: transformDate(returnDate),
      returnProvisionNotificationDate: transformDate(returnProvisionNotificationDate),
      contractDate: transformDate(contractDate),
      contractCompleteDate: transformDate(contractCompleteDate),
      changeStatusDateTime: transformDate(changeStatusDateTime),
      contractExecutionDate: transformDate(contractExecutionDate),
      bidReviewDateTimeEnd: transformDate(bidReviewDateTimeEnd),
      bidDateTimeEnd: transformDate(bidDateTimeEnd),
      auctionDate: auctionDateLocal ? transformDate(DateUtils.toMoscowDateTime(auctionDateLocal, customer.diffHours)) : null,
      purchaseStatusId: purchaseStatus && purchaseStatus.id,
      purchaseTypeId: purchaseType && purchaseType.id,
      tenderPlatformId: tenderPlatform.id,
      customerId: customer && customer.id,
      warningText: customer && customer.warningText,
      isStacionar: customer && customer.isStacionar,
      tempAttachmentIds: files && files.length > 0 ? files.map(_ => _.id) : null,
      purchaseChapterIds: purchaseChapters && purchaseChapters.length > 0 ?
        purchaseChapters.map(_ => _.id) : null,
      documents: documents && PurchaseHelper.getDocumentCreateModel(documents),
    };
  }

  static getDocumentCreateModel(data: DocumentResponse[]): DocumentCreate[] {
    const docsCreate = [];
    data.forEach((doc) => {
      const result = {
        id: doc.id,
        documentTypeId: doc.documentType.id,
        attachmentId: doc.attachmentId,
        tempAttachmentId: doc.tempAttachmentId,
      };
      docsCreate.push(result);
    });
    return docsCreate;
  }
}
