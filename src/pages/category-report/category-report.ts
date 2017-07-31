import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { DatabaseSqlServiceProvider, ToastProvider } from '../../shared/shared-providers'
import { SqliteCallbackModel } from '../../shared/shared-models'
import { ExpenseDetailPage } from '../../shared/shared-pages'

/**
 * Generated class for the CategoryReportPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-category-report',
  templateUrl: 'category-report.html',
})
export class CategoryReportPage {
  loader: any;

  catGuidId: string
  selectedYear: number;
  selectedMonth: string;
  records = [];
  categories = [];

  constructor(public navCtrl: NavController, public databaseSqlServiceProvider: DatabaseSqlServiceProvider, private toast: ToastProvider, public loading: LoadingController, public navParams: NavParams) {

    this.catGuidId = this.navParams.get('catGuidId').toString();
    this.selectedYear = parseInt(this.navParams.get('year'));
    this.selectedMonth = this.navParams.get('month').toString();

  }

  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Checking Database, please wait...',
    });
    this.loader.present().then(() => {
      this.databaseSqlServiceProvider.categoryDbProvider.getAll(e => this.getAllCategoriesCallback(e));
    });
  }

  getAllCategoriesCallback(sqliteCallbackModel: SqliteCallbackModel) {
    this.loader.dismiss();
    if (sqliteCallbackModel.success) {
      this.categories = sqliteCallbackModel.data;
      this.generateClick();
    }
  }

  generateClick() {
    
    this.loader = this.loading.create({
      content: 'Checking Database, please wait...',
    });
    this.loader.present().then(() => {
      this.databaseSqlServiceProvider.expenseDbProvider.getAllInPeriod(this.selectedYear, this.selectedMonth, e => this.getAllInPeriodCallback(e));
    });
  }

  getAllInPeriodCallback(sqliteCallbackModel: SqliteCallbackModel) {
    this.loader.dismiss();
    this.records = [];
    if (sqliteCallbackModel.success) {
      sqliteCallbackModel.data.forEach(rec => {
          if (rec.categoryGuidId === this.catGuidId) {
            let catName = '';
            this.categories.forEach(cat => {
              if (cat.guidId === rec.categoryGuidId) {
                catName = cat.categoryName;
              }
            });
            this.records.push({
              expenseId: rec.id,
              category: catName,
              expenseValue: rec.expenseValue
            })
          }
      });
    }
  }

  detailClick(event, item) {
    let obj = { expenseId: item.expenseId };
    this.navCtrl.push(ExpenseDetailPage, obj);
  }
}
