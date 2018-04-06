import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController, Events, LoadingController } from 'ionic-angular';
import { ToastProvider, DatabaseSqlServiceProvider } from '../../shared/shared-providers'
import { SqliteCallbackModel, CategoryModel, ExpenseModel } from '../../shared/shared-models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForecastPage } from '../../shared/shared-pages';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  formData: any = {};
  loader: any;
  categories: CategoryModel[] = [];
  isTransferExpense: boolean = false;
  isNegativeExpense: boolean = false;
  transferToGuidId = '';
  incomeUsed = 0;
  incomeLeft = 0;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController, public loading: LoadingController,
    public dbProvider: DatabaseSqlServiceProvider,
    public builder: FormBuilder,
    private toast: ToastProvider, public events: Events) {
  }

 

  ionViewDidLoad() {
    this.loadData();
  }

  canExpenseBeNegative() {
    if (this.isTransferExpense) {
      this.isNegativeExpense = false;
      return false;
    }

    if (this.formData.expenseValue === '') {
      this.isNegativeExpense = false;
      return false;
    }

    return true;
  }

  isTransferClick(isTransfer) {
    if (isTransfer) {
      this.isNegativeExpenseClicked(false);
    }
  }
  isNegativeExpenseClicked(isNegative) {
    if (isNegative) {
      this.formData.expenseValue = '-' + this.formData.expenseValue
    } else {
      this.formData.expenseValue = this.formData.expenseValue.replace('-', '');
    }
  }

  getCategoryPlaceholder() {
    if (this.isTransferExpense) {
      return "Transfer from"
    }
    return "Category"
  }

  getNewGuid(): string {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  buildEmptyModel() {
    this.formData.id = 0;
    this.formData.year = parseInt(localStorage.getItem('budgetYear'));
    this.formData.month = localStorage.getItem('budgetMonth');
    this.formData.income = parseFloat(localStorage.getItem('budgetIncome'));
    this.formData.categoryGuidId = '';
    this.formData.expenseValue = '';
    this.formData.expenseCode = '';
    this.formData.comment = '';
    this.formData.inSync = false;
  }

  loadData() {

    this.loader = this.loading.create({
      content: 'Busy, please wait...',
    });
    this.loader.present().then(() => {
      //this.dbProvider.categoryDbProvider.getAll(e => this.getAllCallback(e));
      this.dbProvider.categoryFirebaseDbProdiver.getAll(e => this.getAllCallback(e))
    });

  }

  getAllCallback(result: SqliteCallbackModel) {
    this.loader.dismiss();
    if (result.success) {
      this.categories = result.data;
      this.buildEmptyModel()

      //this.dbProvider.expenseDbProvider.getSumInPeriod(this.formData.year, this.formData.month, e => this.getSumInPeriodCallback(e));
      this.dbProvider.expenseFirebaseDbProdiver.getSumInPeriod(this.formData.year, this.formData.month, e => this.getSumInPeriodCallback(e));

      return;
    }
    this.toast.showToast('Error retrieving data');

  }

  getSumInPeriodCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this.incomeUsed = result.data;
      this.incomeLeft = this.formData.income - this.incomeUsed
    }
  }

  modelToSave: ExpenseModel = null;

  saveClick() {

    if (!this.isTransferExpense) {
      this.modelToSave = {
        id: 0,
        year: parseInt(localStorage.getItem('budgetYear')),
        month: localStorage.getItem('budgetMonth'),
        categoryGuidId: this.formData.categoryGuidId,
        guidId: this.getNewGuid(),
        expenseValue: this.formData.expenseValue,
        comment: this.formData.comment,
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
        guidId: this.getNewGuid(),
        expenseValue: eValue,
        comment: this.formData.comment,
        recordDate: new Date().toString(),
        expenseCode: this.getNewExpenseCode(),
        inSync: false
      }
    }

    this.saveExpense();

  }


  saveExpense() {
    this.modelToSave.inSync = false;
    this.saveExpenseToSql();
  }

  saveExpenseToSql() {
    //this.dbProvider.expenseDbProvider.insertRecord(this.modelToSave, e => this.insertExpenseTableCallback(e));
    this.dbProvider.expenseFirebaseDbProdiver.insertRecord(this.modelToSave, e => this.insertExpenseTableCallback(e));
    if (this.isTransferExpense) {
      this.saveTransfer();
      return;
    } else {
      this.navCtrl.setRoot(HomePage);
    }
  }

  insertExpenseTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this.toast.showToast('Expense uploaded successfully');
      return;
    }
    this.toast.showToast('Error uploading expense');
    alert(JSON.stringify(result.data));
    
  }


  getNewExpenseCode(): string {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  disableSaveButton() {
    if (this.formData.categoryGuidId === undefined || this.formData.categoryGuidId === null || this.formData.categoryGuidId === 0 || this.formData.categoryGuidId === '' ||
      this.formData.expenseValue === undefined || this.formData.expenseValue === null || this.formData.expenseValue === 0) {
      return true;
    }

    if (this.isTransferExpense && this.transferToGuidId === '') {
      return true;
    }

    if (this.isTransferExpense && this.transferToGuidId === this.formData.guidId) {
      return true;
    }

    return false;
  }

  saveTransfer() {
    this.modelToSave = {
      id: 0,
      year: parseInt(localStorage.getItem('budgetYear')),
      month: localStorage.getItem('budgetMonth'),
      categoryGuidId: this.transferToGuidId,
      guidId: this.getNewGuid(),
      expenseValue: this.formData.expenseValue,
      comment: this.formData.comment,
      recordDate: new Date().toString(),
      expenseCode: this.getNewExpenseCode(),
      inSync: false
    }
    this.modelToSave.inSync = false;
    this.saveTransferToSql();
  }

  saveTransferToSql() {
    this.dbProvider.expenseFirebaseDbProdiver.insertRecord(this.modelToSave, e => this.transferToExpenseTableCallback(e));
    this.navCtrl.setRoot(HomePage);
  }

  transferToExpenseTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      this.toast.showToast('Transfer uploaded successfully');
      return;
    }
    this.toast.showToast('Error uploading transfer');
    alert(JSON.stringify(result.data));
  }

  forecastClick() {
    let obj = {
      incomeLeft: this.incomeLeft
    };
    this.navCtrl.push(ForecastPage, obj);
  }

}
