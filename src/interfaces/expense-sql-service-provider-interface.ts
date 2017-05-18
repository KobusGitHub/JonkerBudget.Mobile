
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
    syncTable(year:number, month:string, expenseModel: ExpenseModel[], callbackMethod);
    getAllNonSyncedRecords(year:number, month:string, callbackMethod);
    updateRecordsToSynced(uniqueCodes: string[], callbackMethod);
}