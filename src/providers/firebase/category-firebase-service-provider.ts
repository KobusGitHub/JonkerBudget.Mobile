import { Injectable } from "@angular/core";
import { CategoryModel } from "../../models/category-model";
import { CategorySqlServiceProviderInterface } from "../../shared/shared-interfaces";

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CategoryFirebaseServiceProvider implements CategorySqlServiceProviderInterface {
    //https://www.youtube.com/watch?v=-GjF9pSeFTs

    //users
    //Category
    //Expense,

    constructor(private db: AngularFirestore) { }

    public insertRecord(categoryModel: CategoryModel, callbackMethod) {
        var dd = 6;
        this.db.collection("category").doc(categoryModel.guidId).set(categoryModel).then(docRef => {
            console.log(docRef);
            callbackMethod({ success: true, data: null });
        }).catch(error => {
            console.log(error);
            callbackMethod({ success: false, data: null });
        })
    }

    public getRecord(id, callbackMethod) {
        this.getRecordByGuidId(id, callbackMethod);
    }

    public getRecordByGuidId(guidId, callbackMethod) {
        var docRef = this.db.doc('category/' + guidId);
        var valueChangesSub = docRef.valueChanges();

        var subscription = valueChangesSub.subscribe(res => {
            callbackMethod({ success: true, data: res });
            subscription.unsubscribe();
        }, err => {
            callbackMethod({ success: false, data: err });
            subscription.unsubscribe();
        })
    }

    public getAll(callbackMethod) {
        var categoryCollectionRef = this.db.collection('category', ref => {
            return ref.orderBy('isFavourite', 'desc').orderBy('categoryName');
        });
        var notes = categoryCollectionRef.valueChanges();
        var subscription = notes.subscribe(res => {
            callbackMethod({ success: true, data: res });
        }, err => {
           callbackMethod({ success: false, data: err });
        })
    }

    public updateRecord(categoryModel: CategoryModel, callbackMethod) {
        var docRef = this.db.doc('category/' + categoryModel.guidId);
        docRef.set(categoryModel).then(ok => {
            callbackMethod({ success: true, data: ok });
        }).catch(err => {
            callbackMethod({ success: false, data: err });
        });
    }

    public deleteRecord(id, callbackMethod) {
        this.deleteRecordByGuidId(id, callbackMethod)
    }

    public deleteRecordByGuidId(guidId, callbackMethod) {
        var docRef = this.db.doc('category/' + guidId);
        docRef.delete().then(ok => {
            callbackMethod({ success: true, data: ok });
        }).catch(err => {
            callbackMethod({ success: false, data: err });
        });
    }

    // NOT IMPLEMENTED
    public doesTableExist(callbackMethod) {
        alert('doesTableExist - Not Implemented');
    }
    public initialiseTable(callbackMethod) {
        alert('initialiseTable - Not Implemented');
    }
    public syncTable(categoryModel: CategoryModel[], callbackMethod) {
        alert('syncTable - Not Implemented');

    }
    public getAllNonSyncedRecords(callbackMethod) {
        alert('getAllNonSyncedRecords - Not Implemented');

    }
}
