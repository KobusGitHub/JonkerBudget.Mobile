import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController,Events, LoadingController } from 'ionic-angular';
import { ToastProvider, ExpenseSqlServiceProvider,CategorySqlServiceProvider } from '../../shared/shared-providers'
import { SqliteCallbackModel, CategoryModel, ExpenseModel } from '../../shared/shared-models';
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
  transferToCategoryId = 0;
        

  constructor(public navCtrl: NavController,
  public toastCtrl: ToastController,public loading: LoadingController, 
  public expenseDbProvider: ExpenseSqlServiceProvider, 
  public categoryDbProvider: CategorySqlServiceProvider,
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
    this.formData.categoryId = 0;
    this.formData.expenseValue = 0;
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
     if(result.success) {
      this.categories = result.data;
      this.buildEmptyModel()
      this.loader.dismiss();
      return;
    }
    this.toast.showToast('Error retrieving data');
    this.loader.dismiss();
  }


  saveClick(){
    this.loader = this.loading.create({ 
        content: 'Busy, please wait...', 
    }); 
    this.loader.present().then(() => {
      if(!this.isTransferExpense){
        let expenseModel: ExpenseModel = {
          id: 0,
          year: parseInt(localStorage.getItem('budgetYear')),
          month: localStorage.getItem('budgetMonth'),
          categoryId: this.formData.categoryId,
          expenseValue: this.formData.expenseValue,
          recordDate: new Date().toString(),
          inSync: false
        }
        this.expenseDbProvider.insertRecord(expenseModel, e => this.insertExpenseTableCallback(e));
      } else {

        let eValue = Number((-1) * this.formData.expenseValue);
        console.log(eValue);
        let fromExpenseModel: ExpenseModel = {
          id: 0,
          year: parseInt(localStorage.getItem('budgetYear')),
          month: localStorage.getItem('budgetMonth'),
          categoryId: this.formData.categoryId,
          expenseValue: eValue,
          recordDate: new Date().toString(),
          inSync: false
        }


        
        this.expenseDbProvider.insertRecord(fromExpenseModel, e => this.transferFromExpenseTableCallback(e));
        
      }
    });
  }

  disableSaveButton(){
    if(this.formData.categoryId === undefined || this.formData.categoryId === null || this.formData.categoryId === 0 ||
    this.formData.expenseValue === undefined || this.formData.expenseValue === null ||this.formData.expenseValue < 1){
      return true; 
    }

    if(this.isTransferExpense && this.transferToCategoryId === 0){
      return true;
    }

    if(this.isTransferExpense && this.transferToCategoryId === this.formData.categoryId){
      return true;
    }
    
    return false;
  }
  
  insertExpenseTableCallback(result: SqliteCallbackModel){
        if(result.success) {
            this.toast.showToast('Inserted expense successfully');
            this.loader.dismiss();
            this.navCtrl.setRoot(HomePage);
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));
        this.loader.dismiss();
    }


    transferFromExpenseTableCallback(result: SqliteCallbackModel){
        if(result.success) {
            this.toast.showToast('Transfer from successfully');
            //this.loader.dismiss();

            let eValue = Number(this.formData.expenseValue);
            console.log(eValue);
            let toExpenseModel: ExpenseModel = {
              id: 0,
              year: parseInt(localStorage.getItem('budgetYear')),
              month: localStorage.getItem('budgetMonth'),
              categoryId: this.transferToCategoryId,
              expenseValue: this.formData.expenseValue,
              recordDate: new Date().toString(),
              inSync: false
            }
            this.expenseDbProvider.insertRecord(toExpenseModel, e => this.transferToExpenseTableCallback(e));
            

            //this.navCtrl.setRoot(HomePage);
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));
        this.loader.dismiss();
    }

    transferToExpenseTableCallback(result: SqliteCallbackModel){
        if(result.success) {
            this.toast.showToast('Transfer to successfully');
            this.loader.dismiss();
            this.navCtrl.setRoot(HomePage);
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));
        this.loader.dismiss();
    }



}
