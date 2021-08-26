export interface Room {
  id: string;
  name: string;
  medicalServiceIds: string[];
  branchId: string;
  branchName?: string;
}
