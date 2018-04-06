import { Injectable } from "@angular/core";
import { ExpenseModel } from "../../shared/shared-models";
import { ExpenseSqlServiceProviderInterface } from "../../shared/shared-interfaces";

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { resolve } from "url";

@Injectable()
export class ExpenseFirebaseServiceProvider implements ExpenseSqlServiceProviderInterface {
    //https://www.youtube.com/watch?v=-GjF9pSeFTs

    //users
    //Category
    //Expense,

    constructor(private db: AngularFirestore) { }

    public insertRecord(expenseModel: ExpenseModel, callbackMethod){
        this.db.collection("expense").doc(expenseModel.guidId).set(expenseModel).then(docRef => {
            console.log(docRef);
            callbackMethod({ success: true, data: null });
        }).catch(error => {
            console.log(error);
            callbackMethod({ success: false, data: null });
            
        })
    }
    public getRecord(id, callbackMethod){
        this.getRecordByGuidId(id, callbackMethod);
    }
    public getRecordByGuidId(guidId, callbackMethod) {
        var docRef = this.db.doc('expense/' + guidId);
        var valueChangesSub = docRef.valueChanges();

        var subscription = valueChangesSub.subscribe(res => {
            callbackMethod({ success: true, data: res });
            subscription.unsubscribe();
        }, err => {
            callbackMethod({ success: false, data: err });
            subscription.unsubscribe();
        })
    }
    public getAll(callbackMethod){
        var collectionRef = this.db.collection('expense', ref => {
            return ref.orderBy('recordDate');
        });
        //var notes = categoryCollectionRef.valueChanges();
        var snapshot = collectionRef.snapshotChanges()
            .map(changes => {
                return changes.map(snap => {
                    return snap.payload.doc.data() as ExpenseModel;
                })
            })
        var subscription = snapshot.subscribe(res => {
            callbackMethod({ success: true, data: res });
        }, err => {
           callbackMethod({ success: false, data: err });
        })
    }
    public updateRecord(expenseModel: ExpenseModel, callbackMethod){
        var docRef = this.db.doc('expense/' + expenseModel.guidId);
        docRef.set(expenseModel).then(ok => {
            callbackMethod({ success: true, data: ok });
        }).catch(err => {
            callbackMethod({ success: false, data: err });
        });
    }
    public deleteRecord(id: number, callbackMethod){
        this.deleteRecordByGuidId(id, callbackMethod)
    }
    public deleteRecordByGuidId(guidId, callbackMethod) {
        var docRef = this.db.doc('expense/' + guidId);
        docRef.delete().then(ok => {
            callbackMethod({ success: true, data: ok });
        }).catch(err => {
            callbackMethod({ success: false, data: err });
        });
    }

    public getSumInPeriod(year: number, month: string, callbackMethod){

        var collectionRef = this.db.collection('expense', ref => {
            return ref.where('month', '==', month).where('year', '==', year).orderBy('recordDate');
        });
        //var notes = categoryCollectionRef.valueChanges();
        var snapshot = collectionRef.snapshotChanges()
            .map(changes => {
                return changes.map(snap => {
                    return snap.payload.doc.data() as ExpenseModel;
                })
            })
        var subscription = snapshot.subscribe(res => {
            let expenseValue = 0;
            res.forEach(exp => {
                expenseValue +=  Number(exp.expenseValue);
            });

            callbackMethod({ success: true, data: expenseValue });
        }, err => {
            callbackMethod({ success: false, data: err });
        })

    }
    public getAllInPeriod(year:number, month:string, callbackMethod){
        var collectionRef = this.db.collection('expense', ref => {
            return ref.where('year', '==', year).where('month', '==', month).orderBy('recordDate');
        });
        var notes = collectionRef.valueChanges();
      
        var subscription = notes.subscribe(res => {
            callbackMethod({ success: true, data: res });
        }, err => {
           callbackMethod({ success: false, data: err });
        })

    }
    
    // NOT IMPLEMENTED
    public syncTable(year:number, month:string, expenseModel: ExpenseModel[], callbackMethod){ alert('syncTable - Not Implemented');}
    public getAllNonSyncedRecords(year:number, month:string, callbackMethod){ alert('getAllNonSyncedRecords - Not Implemented');}
    public updateRecordsToSynced(uniqueCodes: string[], callbackMethod){ alert('updateRecordsToSynced - Not Implemented');}
    public doesTableExist(callbackMethod){ alert('doesTableExist - Not Implemented');}
    public initialiseTable(callbackMethod){ alert('initialiseTable - Not Implemented');}
    
}