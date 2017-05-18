
import { ExpenseModel } from "../shared/shared-models";

export interface ExpenseSqlServiceProviderInterface {
    doesTableExist(callbackMethod);
    initialiseTable(callbackMethod);
    insertRecord(expenseModel: ExpenseModel, callbackMethod);
    getRecord(id, callbackMethod);
    getAllInPeriod(year:number, month:string, callbackMethod);
    getAll(callbackMethod);
    updateRecord(expenseModel: ExpenseModel, callbackMethod);
    deleteRecord(id: number, callbackMethod);
    syncTable(expenseModel: ExpenseModel[], callbackMethod);
    getAllNonSyncedRecords(callbackMethod);
}