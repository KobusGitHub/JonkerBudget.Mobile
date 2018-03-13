import { Component, Input } from '@angular/core';
import { DatabaseSqlServiceProvider} from '../../shared/shared-providers';
import { SqliteCallbackModel } from '../../shared/shared-models';
import { ToastController,Events } from 'ionic-angular';

@Component({
  selector: 'track-budget',
  templateUrl: 'track-budget.html'
})
export class TrackBudgetComponent {

  @Input() categoryGuidId: string;
  expenseTotal: number = 0;
  budgetValue: number = 0;
  haveExpenseTotal: boolean = false;
  haveCategoryBudget: boolean = false;
  
  displayTotal = 0;

  textColor = 'lightgray';

  budgetYear = 1900;
  budgetMonth = 'January'

  constructor(public databaseDbProvider: DatabaseSqlServiceProvider) {
    this.categoryGuidId = '';
    this.displayTotal = 0;

    this.budgetYear = parseInt(localStorage.getItem('budgetYear')),
    this.budgetMonth = localStorage.getItem('budgetMonth')
  }

  ngOnChanges(){
    if(this.categoryGuidId === ''){
      return;
    }
    this.loadData();
  }


  loadData(){
    if(!this.categoryGuidId || this.categoryGuidId == ''){
      this.displayTotal = 0;
      return;
    }

    this.expenseTotal = 0;
    this.budgetValue = 0;
    this.haveExpenseTotal = false;
    this.haveCategoryBudget = false;
    this.textColor = 'lightgray';

    
    // this.databaseDbProvider.categoryDbProvider.getRecordByGuidId(this.categoryGuidId, e => this.getCategoryCallback(e))
    // this.databaseDbProvider.expenseDbProvider.getAllInPeriod(this.budgetYear, this.budgetMonth, e => this.getAllExpensesCallback(e))
    this.databaseDbProvider.categoryFirebaseDbProdiver.getRecordByGuidId(this.categoryGuidId, e => this.getCategoryCallback(e))
    this.databaseDbProvider.expenseFirebaseDbProdiver.getAllInPeriod(this.budgetYear, this.budgetMonth, e => this.getAllExpensesCallback(e))
  
  }

  getCategoryCallback(result: SqliteCallbackModel){
    this.haveCategoryBudget = true;
     if(result.success) {
       
        this.budgetValue = result.data.budget;
     }
     if(this.haveCategoryBudget && this.haveExpenseTotal){
       this.calculateValue();
     }
  }

  getAllExpensesCallback(result: SqliteCallbackModel){
     this.haveExpenseTotal = true;
     
     if(result.success) {
       result.data.forEach(expense => {
         if(expense.categoryGuidId == this.categoryGuidId){
           console.log(Number(this.expenseTotal) + ' + ' +  Number(expense.expenseValue));
           this.expenseTotal = Number(this.expenseTotal) + Number(expense.expenseValue)
           console.log('expenseTotal: ' + this.expenseTotal);
           
         }
       });

     }
    if(this.haveCategoryBudget && this.haveExpenseTotal){
       this.calculateValue();
     }
     
     

  }

  calculateValue(){
    console.log(Number(this.budgetValue) + ' - ' +  Number(this.expenseTotal));
    this.displayTotal = this.budgetValue - this.expenseTotal;
    console.log('total:' + this.displayTotal);
    this.textColor = "green"
    if(this.displayTotal < 0){
      this.textColor = "red"
    } 
    
   

  }
}
