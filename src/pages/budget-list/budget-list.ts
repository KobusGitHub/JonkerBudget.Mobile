import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { DatabaseSqlServiceProvider, ToastProvider } from '../../shared/shared-providers';
import { SqliteCallbackModel } from '../../shared/shared-models';
import { SetupPage } from '../../shared/shared-pages'

@Component({
  selector: 'page-budget-list',
  templateUrl: 'budget-list.html',
})
export class BudgetListPage {
  loader: any;
  items: any[];
  haveCategories: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseProvider: DatabaseSqlServiceProvider, public loading: LoadingController, private toast: ToastProvider, public events: Events) {
    this.haveCategories = false;
    events.subscribe('DataUpdated', (time) => {
      this.loadBudget();
    });

   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BudgetList');
    this.loadBudget();
  }


  loadBudget(){

    this.loader = this.loading.create({ 
          content: 'Busy, please wait...', 
      }); 
    this.loader.present().then(() => {
          //this.databaseProvider.categoryDbProvider.getAll(e => this.getAllCallback(e))
          this.databaseProvider.categoryFirebaseDbProdiver.getAll(e => this.getAllCallback(e))
      });

   
  }

  getAllCallback(result: SqliteCallbackModel){
      this.loader.dismiss();
      if(result.success === false) {
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));
      }
      
      this.items = result.data;

      if(this.items.length > 0){
        this.haveCategories = true;
      } else {
        this.haveCategories = false;
      }
  }

  editClick(event, item) {
     //let obj = {budgetSetupId:item.id};
     let obj = {categoryGuidId:item.guidId};
    this.navCtrl.push(SetupPage, obj);
  }

  newItemClick(){
    //let obj = {budgetSetupId:0};
    let obj = {categoryGuidId:''};
    this.navCtrl.push(SetupPage, obj);
  }
}
