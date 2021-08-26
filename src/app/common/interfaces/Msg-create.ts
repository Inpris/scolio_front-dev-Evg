export interface MsgCreate {
  type: string;
  entityType: string;
  entityId: string;
  to: string;
  inReplyToMessageId?: string;
  htmlBody?: string;
  subject?: string;
}
