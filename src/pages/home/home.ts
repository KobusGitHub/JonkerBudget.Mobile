import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController,Events, LoadingController } from 'ionic-angular';
import { ToastProvider, DatabaseSqlServiceProvider, ExpenseApi, OnesignalServiceProvider } from '../../shared/shared-providers'
import { SqliteCallbackModel, CategoryModel, ExpenseModel, ExpenseApiModel } from '../../shared/shared-models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  formData: any = {};
  loader: any;
  categories: CategoryModel[] = [];
  isTransferExpense: boolean = false;
  transferToGuidId = '';

  isDatabaseActive = false;
  isPushNotificationsActive = false;        
  pushNotificationPlayers: string[] = [];

  constructor(public navCtrl: NavController,
  public toastCtrl: ToastController,public loading: LoadingController, 
  public dbProvider: DatabaseSqlServiceProvider,
  public expenseApi: ExpenseApi,
  public builder: FormBuilder,
  private toast: ToastProvider, private onesignalServiceProvider: OnesignalServiceProvider ) {

    this.isDatabaseActive = false;
    this.isPushNotificationsActive = false;     
    this.pushNotificationPlayers = ['3a99540f-e012-4423-b31b-e794e790b13e'];
     
  }

   ionViewDidLoad() {
    this.loadData();
  }

  getCategoryPlaceholder(){
    if(this.isTransferExpense){
      return "Transfer from"
    }
    return "Category"
  }

  buildEmptyModel(){
    this.formData.id = 0;
    this.formData.year = parseInt(localStorage.getItem('budgetYear')),
    this.formData.month = localStorage.getItem('budgetMonth')
    this.formData.categoryGuidId = '';
    this.formData.expenseValue = '';
    this.formData.expenseCode = '';
    this.formData.inSync = false;
  }

  loadData(){
    
    this.loader = this.loading.create({
        content: 'Busy, please wait...',
    });
    this.loader.present().then(() => {
      this.dbProvider.categoryDbProvider.getAll(e => this.getAllCallback(e));
    });

  }

  getAllCallback(result: SqliteCallbackModel){
    this.loader.dismiss();
     if(result.success) {
      this.categories = result.data;
      this.buildEmptyModel()
      return;
    }
    this.toast.showToast('Error retrieving data');
   
  }

  modelToSave: ExpenseModel = null;

  saveClick(){

    if(!this.isTransferExpense){
      this.modelToSave = {
        id: 0,
        year: parseInt(localStorage.getItem('budgetYear')),
        month: localStorage.getItem('budgetMonth'),
        categoryGuidId: this.formData.categoryGuidId,
        expenseValue: this.formData.expenseValue,
        recordDate: new Date().toString(),
        expenseCode: this.getNewExpenseCode(),
        inSync: false
      }
    } else {
      let eValue = Number((-1) * this.formData.expenseValue);
      console.log(eValue);
      this.modelToSave = {
        id: 0,
        year: parseInt(localStorage.getItem('budgetYear')),
        month: localStorage.getItem('budgetMonth'),
        categoryGuidId: this.formData.categoryGuidId,
        expenseValue: eValue,
        recordDate: new Date().toString(),
        expenseCode: this.getNewExpenseCode(),
        inSync: false
      }
    }

    if(this.isDatabaseActive){
      this.saveExpenseToApi();
    } else {
      this.saveExpenseToSql();
    }

  }

  buildApiModelFromSqlModel(sqlModel: ExpenseModel): ExpenseApiModel {
     let apiModel: ExpenseApiModel = {
          id: sqlModel.id,
          year: sqlModel.year,
          month: sqlModel.month,
          categoryGuidId: sqlModel.categoryGuidId,
          expenseValue: sqlModel.expenseValue,
          recordDate: new Date(),
          expenseCode: sqlModel.expenseCode,
          inSync: sqlModel.inSync
        }
      return apiModel;
  }

  saveExpenseToApi(){
    this.loader = this.loading.create({ content: 'Busy uploading expense, please wait...' }); 
    this.loader.present().then(() => {

       
       this.expenseApi.addExpense(this.buildApiModelFromSqlModel(this.modelToSave))
          .subscribe(
              res => {
                  this.loader.dismiss();
                  this.modelToSave.inSync = true;
                  this.saveExpenseToSql();
                  return;
              },
              err => {
                  this.loader.dismiss();
                  alert('Could not upload to server');
                  this.modelToSave.inSync = false;
                  this.saveExpenseToSql();
                  return;
              }
          );
    });
  }

  saveExpenseToSql(){
    this.loader = this.loading.create({ content: 'Busy saving on device, please wait...' }); 
    this.loader.present().then(() => {
      this.dbProvider.expenseDbProvider.insertRecord(this.modelToSave, e => this.insertExpenseTableCallback(e));
    });
  }


  getNewExpenseCode(): string {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };

  disableSaveButton(){
    if(this.formData.categoryGuidId === undefined || this.formData.categoryGuidId === null || this.formData.categoryGuidId === 0 ||
    this.formData.expenseValue === undefined || this.formData.expenseValue === null ||this.formData.expenseValue < 1){
      return true; 
    }

    if(this.isTransferExpense && this.transferToGuidId === ''){
      return true;
    }

    if(this.isTransferExpense && this.transferToGuidId === this.formData.guidId){
      return true;
    }
    
    return false;
  }
  
  insertExpenseTableCallback(result: SqliteCallbackModel){
        this.loader.dismiss();

        if(result.success) {
            this.toast.showToast('Saved expense successfully');

            // Push Notification
            if(this.isPushNotificationsActive){
              this.sendPushNotification();
            }


            if(this.isTransferExpense){
              this.saveTransfer();
            }
            this.navCtrl.setRoot(HomePage);
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error saving expense');
        alert(JSON.stringify(result.data));
        
    }

  sendPushNotification(){
    this.onesignalServiceProvider.sendNotification(this.pushNotificationPlayers, 'Expense Added', 'Expense Added Message', this.modelToSave)
      .subscribe(
      res => {
        alert("message sent");
      },
      err => {
        alert(err.message);
        return;
      }
      ); 
  }

  saveTransfer(){
    this.modelToSave = {
      id: 0,
      year: parseInt(localStorage.getItem('budgetYear')),
      month: localStorage.getItem('budgetMonth'),
      categoryGuidId: this.transferToGuidId,
      expenseValue: this.formData.expenseValue,
      recordDate: new Date().toString(),
      expenseCode: this.getNewExpenseCode(),
      inSync: false
    }

    if (this.isDatabaseActive) {
      this.saveTransferToApi();
    } else {
      this.saveTransferToSql();
    }
   
  }

 saveTransferToApi(){
    this.loader = this.loading.create({ content: 'Busy uploading transfer, please wait...' }); 
    this.loader.present().then(() => {

       this.expenseApi.addExpense(this.buildApiModelFromSqlModel(this.modelToSave))
          .subscribe(
              res => {
                  this.loader.dismiss();
                  this.modelToSave.inSync = true;
                  this.saveTransferToSql();
                  return;
              },
              err => {
                  this.loader.dismiss();
                  this.toast.showToast('Could not upload to server');
                  this.modelToSave.inSync = false;
                  this.saveTransferToSql();
                  return;
              }
          );
    });
  }


  saveTransferToSql(){
    this.loader = this.loading.create({ content: 'Busy saving transfer on device, please wait...' }); 
    this.loader.present().then(() => {
      this.dbProvider.expenseDbProvider.insertRecord(this.modelToSave, e => this.transferToExpenseTableCallback(e));
    });
  }

  transferToExpenseTableCallback(result: SqliteCallbackModel){
      this.loader.dismiss();
      if(result.success) {
          this.toast.showToast('Transfer to successfully');

          // Push Notification
          if (this.isPushNotificationsActive) {
            this.sendPushNotification();
          }

          this.navCtrl.setRoot(HomePage);
          return;
      }
      console.log(result.data);
      this.toast.showToast('Error saving transfer');
      alert(JSON.stringify(result.data));
      
  }



}
