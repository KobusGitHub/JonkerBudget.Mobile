import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ToastProvider, DatabaseSqlServiceProvider, ExpenseApi, CallbackMangerServiceProvider } from '../../shared/shared-providers'
import { SqliteCallbackModel, ExpenseModel, CategoryModel } from '../../shared/shared-models';

/**
 * Generated class for the ForecastPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-forecast',
  templateUrl: 'forecast.html',
})
export class ForecastPage {
  loader: any;
  private year: number = 0;
  private month: string = '';
  private income: number = 0;
  private incomeLeft: number = 0;
  private catBudget: number = 0;
  private forecastBudget = 0;

  private expenses: ExpenseModel[];
  private categories: CategoryModel[];

  private catOutstandingBudgets = [];

  private callbackManger: CallbackMangerServiceProvider;


  constructor(public loading: LoadingController,public navCtrl: NavController, public dbProvider: DatabaseSqlServiceProvider,
    public expenseApi: ExpenseApi, public navParams: NavParams, private toast: ToastProvider) {

    this.callbackManger = new CallbackMangerServiceProvider();

    this.year = parseInt(localStorage.getItem('budgetYear'));
    this.month = localStorage.getItem('budgetMonth');
    this.income = parseFloat(localStorage.getItem('budgetIncome'));
    this.incomeLeft = parseFloat(this.navParams.get('incomeLeft'));
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForecastPage');
    this.getExpenses();
  }

  getExpenses() {
  
    this.loader = this.loading.create({
      content: 'Calculating, please wait...',
    });
    this.loader.present().then(() => {
      
      this.callbackManger.add("getExpensesCallback");
      this.callbackManger.add("getCategoriesCallback");
      //this.dbProvider.expenseDbProvider.getAllInPeriod(this.year, this.month, e => this.getExpensesCallback(e));
      //this.dbProvider.categoryDbProvider.getAll(e => this.getCategoriesCallback(e));

      this.dbProvider.expenseFirebaseDbProdiver.getAllInPeriod(this.year, this.month, e => this.getExpensesCallback(e));
      this.dbProvider.categoryFirebaseDbProdiver.getAll(e => this.getCategoriesCallback(e));

    });

  }

  getExpensesCallback(result: SqliteCallbackModel) {
    
    if (result.success) {
      this.expenses = result.data;
    }

    let done = this.callbackManger.removeCheck('getExpensesCallback');
    if(done === true){
      this.getOutstandingExpenses();
    }
  }

  getCategoriesCallback(result: SqliteCallbackModel) {
    this.catBudget = 0;

    if (result.success) {
      this.categories = result.data;
    }

    let done = this.callbackManger.removeCheck('getCategoriesCallback');
    if (done === true) {
      this.getOutstandingExpenses();
    }
  }

  getOutstandingExpenses(){

    this.catOutstandingBudgets = [];


    let budgetToAdd: number = 0;

    this.categories.forEach(cat => {
      let catGuidId = cat.guidId;
      let catBudget = cat.budget;
      console.log(cat.categoryName);

      let sumExpense = 0;
      this.expenses.forEach(expense => {
        if(expense.categoryGuidId == catGuidId){
          sumExpense += expense.expenseValue;
        }
      });
      console.log('catBudget:' + catBudget);
      console.log('sumExpense:' + sumExpense);
      

      if(catBudget > sumExpense){
        let catBudgetToAdd = catBudget - sumExpense;
        this.catOutstandingBudgets.push({ category: cat.categoryName, outstandingValue: catBudgetToAdd, selected: true })
        budgetToAdd += catBudgetToAdd;
        console.log('catBudgetToAdd:' + catBudgetToAdd);

      }
    });
    this.calculate();
    this.loader.dismiss();
  }

  calculate(){
    let outstandingExpenseSum: number = 0;
    this.catOutstandingBudgets.forEach(outstanding => {
      if(outstanding.selected === true){
        outstandingExpenseSum += outstanding.outstandingValue
      }
    });

    console.log('calculate');
    console.log('this.incomeLeft:' + this.incomeLeft);
    console.log('this.outstandingExpenseSum:' + outstandingExpenseSum);

    this.forecastBudget = this.incomeLeft - outstandingExpenseSum;
    console.log('this.forecastBudget:' + this.forecastBudget);
    
  }

  budgetClick(outstandingBudget){
    if (outstandingBudget.selected === true){
      outstandingBudget.selected = false;
    } else {
      outstandingBudget.selected = true;
    }
    this.calculate();
  }


}
