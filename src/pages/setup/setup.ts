import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { DatabaseSqlServiceProvider } from '../../shared/shared-providers'
import { CategoryModel, SqliteCallbackModel } from '../../shared/shared-models';
import { ToastProvider } from '../../shared/shared-providers'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {
  loader: any;
  private budgetSetupId = 0;
  frmBudget: FormGroup;
  formData: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private databaseSqlServiceProvider: DatabaseSqlServiceProvider,
    public loading: LoadingController, public events: Events,
    private toast: ToastProvider, public builder: FormBuilder) {
       this.budgetSetupId = parseInt(this.navParams.get('budgetSetupId'));

       console.log(this.budgetSetupId);

       if(!this.budgetSetupId){
         this.budgetSetupId = 0
       }
       console.log(this.budgetSetupId);

        this.frmBudget = builder.group({
          'frmCmpCategory': [{ value: '' },Validators.required],
          'frmCmpBudget': [{ value: '' },Validators.required]
      });

      this.loadData();
      console.log(this.formData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Setup');
  }


  loadData(){
    if(this.budgetSetupId === 0){
      this.buildEmptyModel();
      return;
    }

    this.loader = this.loading.create({
        content: 'Busy, please wait...',
    });
    this.loader.present().then(() => {
      this.databaseSqlServiceProvider.categoryDbProvider.getRecord(this.budgetSetupId, e => this.getRecordCallback(e));
    });
  }

  getRecordCallback(result: SqliteCallbackModel){
    if(result.success) {
      this.formData = result.data;
      this.loader.dismiss();
      return;
    }
    this.toast.showToast('Error retrieving data');
    this.loader.dismiss();
  }

  buildEmptyModel(){
    this.formData.id = 0;
    this.formData.guidId = '';
    this.formData.categoryName = '';
    this.formData.budget = '';
    this.formData.inSync = false;
  }


  saveClick(frmCmps){
    let categoryModel: CategoryModel = {
      id: this.budgetSetupId,
      guidId: this.formData.guidId,
      categoryName: frmCmps.frmCmpCategory,
      budget: frmCmps.frmCmpBudget,
      inSync: false
    }
    this.loader = this.loading.create({ 
        content: 'Busy, please wait...', 
    }); 
    this.loader.present().then(() => {
      if(this.budgetSetupId === 0){
        categoryModel.guidId = this.getNewGuid();
        this.databaseSqlServiceProvider.categoryDbProvider.insertRecord(categoryModel, e => this.insertBudgetSetupTableCallback(e));
      } else {
        this.databaseSqlServiceProvider.categoryDbProvider.updateRecord(categoryModel, e => this.updateBudgetSetupTableCallback(e));
        
      }
    });
  }

  insertBudgetSetupTableCallback(result: SqliteCallbackModel){
    console.log(result);
        if(result.success) {
            this.toast.showToast('Insert budget successfully');
            this.loader.dismiss();
            this.events.publish('DataUpdated', Date.now());
            this.navCtrl.pop();
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));
        this.loader.dismiss();
    }

    updateBudgetSetupTableCallback(result: SqliteCallbackModel){
    console.log(result);
        if(result.success) {
            this.toast.showToast('Updated budget successfully');
            this.loader.dismiss();
            this.events.publish('DataUpdated', Date.now());
            this.navCtrl.pop();
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));
        this.loader.dismiss();
    }

    getNewGuid(): string {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    };
  
}
