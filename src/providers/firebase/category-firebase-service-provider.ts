import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { CategoryModel } from "../../models/category-model";
import { CategorySqlServiceProviderInterface } from "../../shared/shared-interfaces";
import { FirebaseDatabase } from "@firebase/database-types";

@Injectable()
export class CategoryFirebaseServiceProvider implements CategorySqlServiceProviderInterface {
    private categoryRef = this.db.list<CategoryModel>('category')

    //users
    //Category
    //Expense,

    constructor(private db: AngularFireDatabase) { }

    getCategories() {
        return this.categoryRef;
    }

    addCategory(category: CategoryModel) {
        return this.categoryRef.push(category);
    }

    public doesTableExist(callbackMethod) {
        alert('doesTableExist - Not Implemented');
    }

    public initialiseTable(callbackMethod) {
        alert('initialiseTable - Not Implemented');

    }
    public insertRecord(categoryModel: CategoryModel, callbackMethod) {
        // categoryModel.key = categoryModel.guidId;
        // return this.categoryRef.push(categoryModel).then(ref => {
        //     callbackMethod({success: true, data: ref.key});
        // });

        var ref = this.db.database.ref();
        var dd = ref.child('category/' + categoryModel.guidId).set(categoryModel).then(ref => {
            callbackMethod({ success: true, data: ref.key });
        });

    }
    public getRecord(id, callbackMethod) {
        this.getRecordByGuidId(id, callbackMethod);
    }
    public getRecordByGuidId(guidId, callbackMethod) {
        var ref = this.db.database.ref();
        var catRef = ref.child('category/' + guidId);
        catRef.once('value').then(catSnap => {
            callbackMethod({ success: true, data: catSnap.val() });
        })
    }

    public getAll(callbackMethod) {
        var ref = this.db.database.ref();
        var catRef = ref.child('category').orderByValue();
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
    public updateRecord(categoryModel: CategoryModel, callbackMethod) {
        alert('updateRecord - Not Implemented');

    }
    public deleteRecord(id: number, callbackMethod) {
        alert('deleteRecord - Not Implemented');

    }
    public syncTable(categoryModel: CategoryModel[], callbackMethod) {
        alert('syncTable - Not Implemented');

    }
    public getAllNonSyncedRecords(callbackMethod) {
        alert('getAllNonSyncedRecords - Not Implemented');

    }
}
