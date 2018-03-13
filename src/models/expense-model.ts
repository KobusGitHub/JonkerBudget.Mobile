export class ExpenseModel {
  id?: number;
  guidId: string;
  categoryGuidId: string;
  expenseValue: number;
  year: number;
  month: string;
  recordDate: string;
  expenseCode: string;
  comment: string;
  inSync: boolean;
  year_month?: string;

}
