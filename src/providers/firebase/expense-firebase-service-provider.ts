import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { ExpenseModel } from "../../shared/shared-models";
import { ExpenseSqlServiceProviderInterface } from "../../shared/shared-interfaces";
import { FirebaseDatabase } from "@firebase/database-types";


@Injectable()
export class ExpenseFirebaseServiceProvider implements ExpenseSqlServiceProviderInterface {
    private expenseRef = this.db.list<ExpenseModel>('expense')

    constructor(private db: AngularFireDatabase) { }
    
    public insertRecord(expenseModel: ExpenseModel, callbackMethod){
        expenseModel.year_month = expenseModel.year + '_' + expenseModel.month;
        var ref = this.db.database.ref();
        var dd = ref.child('expense/' + expenseModel.guidId).set(expenseModel).then(ref => {
            callbackMethod({ success: true, data: null });
        });
    }
    public getRecord(id, callbackMethod){
        this.getRecordByGuidId(id, callbackMethod);
    }
    public getRecordByGuidId(guidId, callbackMethod) {
        var ref = this.db.database.ref();
        var catRef = ref.child('expense/' + guidId);
        catRef.once('value').then(catSnap => {
            callbackMethod({ success: true, data: catSnap.val() });
        })
    }
    public getAll(callbackMethod){
        var ref = this.db.database.ref();
        var catRef = ref.child('expense').orderByValue();
        catRef.on('value', snapshot => {
            let data: any[] = [];
    
            snapshot.forEach((snap) => {
                data.push(snap.val());
                console.log(snap);
                return false;
            })
            callbackMethod({ success: true, data:data });
        })
    }
    public updateRecord(expenseModel: ExpenseModel, callbackMethod){
        this.expenseRef.update(expenseModel.guidId, expenseModel).then(ok => {
            callbackMethod({ success: true, data: ok });
        }, error => {
            callbackMethod({ success: true, data: error });
        });
    }
    public deleteRecord(id: number, callbackMethod){
        this.deleteRecordByGuidId(id, callbackMethod)
    }
    public deleteRecordByGuidId(guidId, callbackMethod) {
        this.expenseRef.remove(guidId).then(ok => {
            callbackMethod({ success: true, data: ok });
        }, error => {
            callbackMethod({ success: true, data: error });
        });
    }

    public getSumInPeriod(year: number, month: string, callbackMethod){
        var ref = this.db.database.ref();
        var catRef = ref.child('expense').orderByChild('year_month').equalTo(year + '_' + month);
        catRef.on('value', snapshot => {
            let expenseValue = 0;
    
            snapshot.forEach((snap) => {
                expenseValue +=  Number(snap.val().expenseValue);
                return false;
            })
            callbackMethod({ success: true, data:expenseValue });
        })
    }
    public getAllInPeriod(year:number, month:string, callbackMethod){
        var ref = this.db.database.ref();
        var catRef = ref.child('expense').orderByChild('year_month').equalTo(year + '_' + month);
        catRef.on('value', snapshot => {
            let data: any[] = [];
    
            snapshot.forEach((snap) => {
                data.push(snap.val());
                console.log(snap);
                return false;
            })
            callbackMethod({ success: true, data:data });
        })
    }
    
    // NOT IMPLEMENTED
    public syncTable(year:number, month:string, expenseModel: ExpenseModel[], callbackMethod){ alert('syncTable - Not Implemented');}
    public getAllNonSyncedRecords(year:number, month:string, callbackMethod){ alert('getAllNonSyncedRecords - Not Implemented');}
    public updateRecordsToSynced(uniqueCodes: string[], callbackMethod){ alert('updateRecordsToSynced - Not Implemented');}
    public doesTableExist(callbackMethod){ alert('doesTableExist - Not Implemented');}
    public initialiseTable(callbackMethod){ alert('initialiseTable - Not Implemented');}
    
}