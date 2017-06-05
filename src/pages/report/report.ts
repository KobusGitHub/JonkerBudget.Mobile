import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DatabaseSqlServiceProvider, ToastProvider } from '../../shared/shared-providers'
import { SqliteCallbackModel} from '../../shared/shared-models'
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  loader: any;

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  years = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027"];
  
  selectedMonth = '';
  selectedYear = 1900;
  showReport = false;

  categories = null;
  records = [];

  constructor(private events: Events, public navCtrl: NavController, public navParams: NavParams, private toast: ToastProvider, public loading: LoadingController, public databaseSqlServiceProvider: DatabaseSqlServiceProvider) {
    this.selectedYear = parseInt(localStorage.getItem('budgetYear'));
    this.selectedMonth = localStorage.getItem('budgetMonth');

    
  }

  ionViewDidLoad() {
    this.loader = this.loading.create({ 
        content: 'Checking Database, please wait...', 
    }); 
    this.loader.present().then(() => {
        this.databaseSqlServiceProvider.categoryDbProvider.getAll(e => this.getAllCategoriesCallback(e)); 
    });
  }

  getAllCategoriesCallback(sqliteCallbackModel: SqliteCallbackModel){
    this.loader.dismiss();
    if(sqliteCallbackModel.success){
      this.categories = sqliteCallbackModel.data;
    }
  }

  generateClick(){
    this.showReport = true;
    this.loader = this.loading.create({ 
        content: 'Checking Database, please wait...', 
    }); 
    this.loader.present().then(() => {
        this.databaseSqlServiceProvider.expenseDbProvider.getAllInPeriod(this.selectedYear, this.selectedMonth, e => this.getAllInPeriodCallback(e)); 
    });
  }

  getAllInPeriodCallback(sqliteCallbackModel: SqliteCallbackModel){
    this.loader.dismiss();
    this.records = [];
    if(sqliteCallbackModel.success){
      let catName = '';
      
      sqliteCallbackModel.data.forEach(rec => {
        this.categories.forEach(cat => {
          if(cat.guidId === rec.categoryGuidId){
            catName = cat.categoryName;
          }
        });

        this.records.push({
          category: catName,
          expenseValue: rec.expenseValue
        })
      });

     
    }

  }

}
