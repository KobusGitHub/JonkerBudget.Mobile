import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DatabaseSqlServiceProvider, ToastProvider } from '../../shared/shared-providers'
import { SqliteCallbackModel } from '../../shared/shared-models'
import { CategoryReportPage} from '../../shared/shared-pages'
import { LoadingController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
/**
 * Generated class for the NetReport page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-net-report',
  templateUrl: 'net-report.html',
})
export class NetReportPage {
loader: any;

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  years = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027"];
  
  selectedMonth = '';
  selectedYear = 1900;
  showReport = false;
  categories = [];
  
  constructor(private events: Events, public navCtrl: NavController, public navParams: NavParams, private toast: ToastProvider, public loading: LoadingController, public databaseSqlServiceProvider: DatabaseSqlServiceProvider, private emailComposer: EmailComposer) {
    this.selectedYear = parseInt(localStorage.getItem('budgetYear'));
    this.selectedMonth = localStorage.getItem('budgetMonth');
  
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

  getAllCategoriesCallback(sqliteCallbackModel: SqliteCallbackModel){
    this.categories = [];
    this.loader.dismiss();
    if(sqliteCallbackModel.success){
      sqliteCallbackModel.data.forEach(cat => {
        this.categories.push({ 
          guidId: cat.guidId,
          categoryName: cat.categoryName,
          budget: cat.budget,
          expenseValue: 0,
          textColor: 'lightgray'
        })
      });
      this.generateClick();
      
    }
  }

  generateClick(){
    this.showReport = true;
    this.categories.forEach(cat => {
      cat.expenseValue = 0;
    });
    this.loader = this.loading.create({ 
        content: 'Checking Database, please wait...', 
    }); 
    this.loader.present().then(() => {
        //this.databaseSqlServiceProvider.expenseDbProvider.getAllInPeriod(this.selectedYear, this.selectedMonth, e => this.getAllInPeriodCallback(e)); 
        this.databaseSqlServiceProvider.expenseFirebaseDbProdiver.getAllInPeriod(this.selectedYear, this.selectedMonth, e => this.getAllInPeriodCallback(e)); 
    });
  }

  getAllInPeriodCallback(sqliteCallbackModel: SqliteCallbackModel){
    this.loader.dismiss();

    this.categories.forEach(cat => {
      cat.expenseValue = 0;
    });
    if(sqliteCallbackModel.success){

      sqliteCallbackModel.data.forEach(rec => {
        this.categories.forEach(cat => {
          if(cat.guidId === rec.categoryGuidId){
            cat.expenseValue = parseInt(cat.expenseValue) + parseInt(rec.expenseValue)

            if(cat.expenseValue > cat.budget){
              cat.textColor = 'red';
            } else {
              cat.textColor = 'green';
            }
          }
        });

       
      });

     
    }

  }

  detailClick(event, item) {
    let obj = { 
      catGuidId: item.guidId,
      year: this.selectedYear,
      month: this.selectedMonth
     };
    this.navCtrl.push(CategoryReportPage, obj);
  }


  sendMail() {
    let messageBody = "Category,Budget,ExpenseValue<br>";
    this.categories.forEach(categoryRec => {
      messageBody = messageBody + categoryRec.categoryName + "," + categoryRec.budget + "," + categoryRec.expenseValue + "<br>"
    });
   
    let email = {
      to: null,
      cc: null,
      bcc: null,
      attachments: null,
      // attachments: [
      //   'file://img/logo.png',
      //   'res://icon.png',
      //   'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
      //   'file://README.pdf'
      // ],
      subject: 'Home Budget - Net Report',
      body: messageBody,
      isHtml: true
    };
    this.emailComposer.open(email);
  }

}
