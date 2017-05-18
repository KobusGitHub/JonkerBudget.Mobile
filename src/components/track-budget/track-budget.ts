import { Component, Input } from '@angular/core';
import { DatabaseSqlServiceProvider} from '../../shared/shared-providers';
import { SqliteCallbackModel } from '../../shared/shared-models';
import { ToastController,Events } from 'ionic-angular';

@Component({
  selector: 'track-budget',
  templateUrl: 'track-budget.html'
})
export class TrackBudgetComponent {

  @Input() categoryId: number;
  displayText : string;
  expenseTotal: number = 0;
  budgetValue: number = 0;
  haveExpenseTotal: boolean = false;
  haveCategoryBudget: boolean = false;
  
  textColor = 'black';

  budgetYear = 1900;
  budgetMonth = 'January'

  constructor(public databaseDbProvider: DatabaseSqlServiceProvider) {
    this.categoryId = 0;
    this.displayText = '';

    this.budgetYear = parseInt(localStorage.getItem('budgetYear')),
    this.budgetMonth = localStorage.getItem('budgetMonth')
  }

  ngOnChanges(){
    if(!this.categoryId){
      return;
    }
    this.loadData();
  }


  loadData(){
    if(!this.categoryId || this.categoryId == 0){
      this.displayText = '';
      return;
    }

    this.expenseTotal = 0;
    this.budgetValue = 0;
    this.haveExpenseTotal = false;
    this.haveCategoryBudget = false;
    this.textColor = 'black';

    
    this.databaseDbProvider.categoryDbProvider.getRecord(this.categoryId, e => this.getCategoryCallback(e))
    this.databaseDbProvider.expenseDbProvider.getAllInPeriod(this.budgetYear, this.budgetMonth, e => this.getAllExpensesCallback(e))
  
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
         if(expense.categoryId == this.categoryId){
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
    let total = this.budgetValue - this.expenseTotal;
    console.log('total:' + total);
    this.textColor = "green"
    if(total < 0){
      this.textColor = "red"
    } 
    this.displayText = 'R' + total.toString();
    
  }
}
