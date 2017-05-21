import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseSqlServiceProvider, ExpenseApi, ToastProvider } from '../../shared/shared-providers';
import { SqliteCallbackModel, ExpenseModel } from '../../shared/shared-models';
import { LoadingController } from 'ionic-angular';


/**
 * Generated class for the Sync page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
})
export class SyncPage {
  private loader : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastProvider, private databaseSqlServiceProvider: DatabaseSqlServiceProvider, private expenseApi: ExpenseApi ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Sync');
  }

  syncClick(){
    this.databaseSqlServiceProvider.categoryDbProvider.getAllNonSyncedRecords(e => this.getNonSyncedCategoryCallback(e))

    //this.databaseSqlServiceProvider.expenseDbProvider.getAllNonSyncedRecords(2017, 'May', e => this.getAllNonSyncedRecordsCallback(e));

  }

  getNonSyncedCategoryCallback(sqliteCallbackModel: SqliteCallbackModel){
    //alert(JSON.stringify(sqliteCallbackModel.data))
    if(!sqliteCallbackModel.success){
      this.toast.showToast("Error getting data to sync");
      return;
    }

    
  }

  getAllNonSyncedRecordsCallback(sqliteCallbackModel: SqliteCallbackModel){
    alert(JSON.stringify(sqliteCallbackModel.data))
    
    if(!sqliteCallbackModel.success){
      this.toast.showToast("Error getting data to sync");
      return;
    }


    // let data = JSON.parse(sqliteCallbackModel.data);
    // alert(data);

    

    this.loader = this.loading.create({
        content: 'busy please wait...',
    });
    this.loader.present().then(() => {
      
     
      this.expenseApi.addExpenses(JSON.stringify(sqliteCallbackModel.data))
          .subscribe(
              res => {
                  this.loader.dismiss();  
                  this.toast.showToast('Expenses Uploaded Successfully');
              },
              err => {
                  this.loader.dismiss();
                  alert('Error uploading expenses');
                  console.log(err);
                  return;
              }
          );
    }); 
  }

}
