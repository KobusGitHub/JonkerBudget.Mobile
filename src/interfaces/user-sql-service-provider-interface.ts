
import { UserModel } from "../shared/shared-models";

export interface UserSqlServiceProviderInterface {
    doesTableExist(callbackMethod);
    initialiseTable(callbackMethod);
    insertRecord(userModel: UserModel, callbackMethod);
    getRecord(id, callbackMethod);
    getAll(callbackMethod);
    updateRecord(userModel: UserModel, callbackMethod);
    deleteRecord(id: number, callbackMethod);
    syncTable(userModels: UserModel[], callbackMethod);
    getAllNonSyncedRecords(callbackMethod);
}