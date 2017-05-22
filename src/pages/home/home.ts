import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController,Events, LoadingController } from 'ionic-angular';
import { ToastProvider, ExpenseSqlServiceProvider,CategorySqlServiceProvider, ExpenseApi } from '../../shared/shared-providers'
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
        

  constructor(public navCtrl: NavController,
  public toastCtrl: ToastController,public loading: LoadingController, 
  public expenseDbProvider: ExpenseSqlServiceProvider, 
  public categoryDbProvider: CategorySqlServiceProvider,
  public expenseApi: ExpenseApi,
  public builder: FormBuilder,
  private toast: ToastProvider) {
     
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
    this.formData.expenseValue = 0;
    this.formData.expenseCode = '';
    this.formData.inSync = false;
  }

   loadData(){
    
    this.loader = this.loading.create({
        content: 'Busy, please wait...',
    });
    this.loader.present().then(() => {
      this.categoryDbProvider.getAll(e => this.getAllCallback(e));
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

    this.saveExpenseToApi();

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
      this.expenseDbProvider.insertRecord(this.modelToSave, e => this.insertExpenseTableCallback(e));
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
            if(this.isTransferExpense){
              this.saveTransferToApi();
            }
            this.navCtrl.setRoot(HomePage);
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error saving expense');
        alert(JSON.stringify(result.data));
        
    }

  

 saveTransferToApi(){
    this.loader = this.loading.create({ content: 'Busy uploading transfer, please wait...' }); 
    this.loader.present().then(() => {

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
      this.expenseDbProvider.insertRecord(this.modelToSave, e => this.transferToExpenseTableCallback(e));
    });
  }




    // transferFromExpenseTableCallback(result: SqliteCallbackModel){
    //     if(result.success) {
    //         this.toast.showToast('Transfer from successfully');
    //         //this.loader.dismiss();

    //         let eValue = Number(this.formData.expenseValue);
    //         console.log(eValue);
    //         let toExpenseModel: ExpenseModel = {
    //           id: 0,
    //           year: parseInt(localStorage.getItem('budgetYear')),
    //           month: localStorage.getItem('budgetMonth'),
    //           categoryGuidId: this.transferToGuidId,
    //           expenseValue: this.formData.expenseValue,
    //           recordDate: new Date().toString(),
    //           expenseCode: this.getNewExpenseCode(),
    //       inSync: false
    //         }
    //         this.expenseDbProvider.insertRecord(toExpenseModel, e => this.transferToExpenseTableCallback(e));
            

    //         //this.navCtrl.setRoot(HomePage);
    //         return;
    //     }
    //     console.log(result.data);
    //     this.toast.showToast('Error');
    //     alert(JSON.stringify(result.data));
    //     this.loader.dismiss();
    // }

    transferToExpenseTableCallback(result: SqliteCallbackModel){
       this.loader.dismiss();
       if(result.success) {
            this.toast.showToast('Transfer to successfully');
            this.navCtrl.setRoot(HomePage);
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error saving transfer');
        alert(JSON.stringify(result.data));
        
    }



}
