import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DatabaseSqlServiceProvider, ToastProvider } from '../../shared/shared-providers'
import { SqliteCallbackModel } from '../../shared/shared-models'

@Component({
  selector: 'page-expense-detail',
  templateUrl: 'expense-detail.html',
})
export class ExpenseDetailPage {
  loader: any;
  record: any = {};
  categories = null;
  //private expenseId = 0
  expenseGuidId = '';
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastProvider, public loading: LoadingController, public databaseSqlServiceProvider: DatabaseSqlServiceProvider) {
    //this.expenseId = parseInt(this.navParams.get('expenseId'));
    this.expenseGuidId = this.navParams.get('expenseGuidId');
    this.record.expenseValue = 0;
  }

  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Checking Database, please wait...',
    });
    this.loader.present().then(() => {
      //this.databaseSqlServiceProvider.categoryDbProvider.getAll(e => this.getAllCategoriesCallback(e));
      this.databaseSqlServiceProvider.categoryFirebaseDbProdiver.getAll(e => this.getAllCategoriesCallback(e));
    });
  }

  getAllCategoriesCallback(sqliteCallbackModel: SqliteCallbackModel) {
    this.loader.dismiss();
    if (sqliteCallbackModel.success) {
      this.categories = sqliteCallbackModel.data;
      this.getExpense();
    }
  }

  getExpense() {
    this.loader = this.loading.create({
      content: 'Checking Database, please wait...',
    });
    this.loader.present().then(() => {
      //this.databaseSqlServiceProvider.expenseDbProvider.getRecord(this.expenseId, e => this.getExpenseRecordCallback(e));
      this.databaseSqlServiceProvider.expenseFirebaseDbProdiver.getRecord(this.expenseGuidId, e => this.getExpenseRecordCallback(e));
    });
  }

  getExpenseRecordCallback(sqliteCallbackModel: SqliteCallbackModel) {
    this.loader.dismiss();
    if (sqliteCallbackModel.success) {
      let catName = '';


      let rec = sqliteCallbackModel.data;
      

      this.categories.forEach(cat => {
        if (cat.guidId === rec.categoryGuidId) {
          catName = cat.categoryName;
        }
      });

      let dt = new Date(rec.recordDate);

      this.record = {
        expenseGuidId: rec.guidId,
        category: catName,
        expenseValue: rec.expenseValue,
        comment: rec.comment,
        //recordDate: rec.recordDate
        recordDate: dt.getDate() + ' ' + this.monthNames[(dt.getMonth())] + ' ' + dt.getFullYear()
      };
     
    }
  }


}
