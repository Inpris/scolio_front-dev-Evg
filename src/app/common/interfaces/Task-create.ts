export interface TaskCreate {
  subject: string;
  description: string;
  priority: string;
  dueDateTime: string | Date;
  entityType: string;
  entityId: string;
  assignedUserId: string;
  eventStatusId: string;
  taskStatusId: string;
}
