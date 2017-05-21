
import { CategoryModel } from "../shared/shared-models";

export interface CategorySqlServiceProviderInterface {
    doesTableExist(callbackMethod);
    initialiseTable(callbackMethod);
    insertRecord(categoryModel: CategoryModel, callbackMethod);
    getRecord(id, callbackMethod);
    getRecordByGuidId(guidId, callbackMethod);
    getAll(callbackMethod);
    updateRecord(categoryModel: CategoryModel, callbackMethod);
    deleteRecord(id: number, callbackMethod);
    syncTable(categoryModel: CategoryModel[], callbackMethod);
    getAllNonSyncedRecords(callbackMethod);
}