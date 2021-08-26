export interface EmailCreate {
  entityType: string;
  entityId: string;
  from: string;
  to: string;
  htmlBody: string;
  subject: string;
  inReplyToMessageId: string;
}
