import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { DatabaseSqlServiceProvider } from '../../shared/shared-providers'
import { CategoryModel, SqliteCallbackModel } from '../../shared/shared-models';
import { ToastProvider, CategoryApi } from '../../shared/shared-providers'

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
    public loading: LoadingController, public events: Events, public categoryApi: CategoryApi,
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


  modelToSave: CategoryModel = null;

  saveClick(frmCmps){
    this.modelToSave = {
      id: this.budgetSetupId,
      guidId: this.formData.guidId,
      categoryName: frmCmps.frmCmpCategory,
      budget: frmCmps.frmCmpBudget,
      inSync: false
    }


    if(this.budgetSetupId === 0){
       this.modelToSave.guidId = this.getNewGuid();
    }
    this.saveCategoryToApi();
  }


   saveCategoryToApi(){
    this.loader = this.loading.create({ content: 'Busy uploading category, please wait...' }); 
    this.loader.present().then(() => {

      if(this.budgetSetupId === 0){
        this.categoryApi.addCategory(this.modelToSave)
          .subscribe(
              res => {
                  this.loader.dismiss();
                  this.modelToSave.inSync = true;
                  this.saveCategoryToSql();
                  return;
              },
              err => {
                  this.loader.dismiss();
                  alert('Could not upload to server');
                  this.modelToSave.inSync = false;
                  this.saveCategoryToSql();
                  return;
              }
          );
        } else {
          this.categoryApi.updateCategory(this.modelToSave)
            .subscribe(
                res => {
                    this.loader.dismiss();
                    this.modelToSave.inSync = true;
                    this.saveCategoryToSql();
                    return;
                },
                err => {
                    this.loader.dismiss();
                    alert('Could not upload to server');
                    this.modelToSave.inSync = false;
                    this.saveCategoryToSql();
                    return;
                }
            );
        }
    });
  }


  saveCategoryToSql(){
    this.loader = this.loading.create({ content: 'Busy saving on device, please wait...' }); 
    this.loader.present().then(() => {
      if(this.budgetSetupId === 0){
        this.databaseSqlServiceProvider.categoryDbProvider.insertRecord(this.modelToSave, e => this.insertBudgetSetupTableCallback(e));
      } else {
        this.databaseSqlServiceProvider.categoryDbProvider.updateRecord(this.modelToSave, e => this.updateBudgetSetupTableCallback(e));

      }
    });
  }


  insertBudgetSetupTableCallback(result: SqliteCallbackModel){
    this.loader.dismiss();
    if(result.success) {
        this.toast.showToast('Insert category successfully');
        this.events.publish('DataUpdated', Date.now());
        this.navCtrl.pop();
        return;
    }
    this.toast.showToast('Error');
  }

  updateBudgetSetupTableCallback(result: SqliteCallbackModel){
    this.loader.dismiss();
    if(result.success) {
        this.toast.showToast('Updated category successfully');
        this.events.publish('DataUpdated', Date.now());
        this.navCtrl.pop();
        return;
    }
    this.toast.showToast('Error');
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
