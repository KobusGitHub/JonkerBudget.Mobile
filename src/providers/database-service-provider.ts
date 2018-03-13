import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { UserSqlServiceProvider, MockUserSqlServiceProvider, 
  ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
  CategorySqlServiceProvider, MockCategorySqlServiceProvider, CategoryFirebaseServiceProvider} from '../shared/shared-providers';
import { CategorySqlServiceProviderInterface, ExpenseSqlServiceProviderInterface, UserSqlServiceProviderInterface } from '../shared/shared-interfaces';
import { ExpenseFirebaseServiceProvider } from './firebase/expense-firebase-service-provider';

@Injectable()
export class DatabaseSqlServiceProvider {
  
  public categoryFirebaseDbProdiver: CategoryFirebaseServiceProvider;
  public expenseFirebaseDbProdiver: ExpenseFirebaseServiceProvider;
  public userDbProvider: UserSqlServiceProviderInterface;
  public categoryDbProvider: CategorySqlServiceProviderInterface;
  public expenseDbProvider: ExpenseSqlServiceProviderInterface;

  constructor(private userSqlServiceProvider: UserSqlServiceProvider, 
              private mockUserSqlServiceProvider: MockUserSqlServiceProvider, 
              private categorySqlServiceProvider: CategorySqlServiceProvider,
              private mockCategorySqlServiceProvider: MockCategorySqlServiceProvider,
              private expenseSqlServiceProvider: ExpenseSqlServiceProvider,
              private mockExpenseSqlServiceProvider: MockExpenseSqlServiceProvider,
            private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider,
            private expenseFirebaseServiceProvider: ExpenseFirebaseServiceProvider) {

    if(this.parseBoolean(localStorage.getItem("browserMode"))) {
      this.userDbProvider = mockUserSqlServiceProvider;
      this.categoryDbProvider = mockCategorySqlServiceProvider; // TODO
      this.expenseDbProvider = mockExpenseSqlServiceProvider;
    } else {
      this.userDbProvider = userSqlServiceProvider;
      this.categoryDbProvider = categorySqlServiceProvider;
      this.expenseDbProvider = expenseSqlServiceProvider;
      this.categoryFirebaseDbProdiver = categoryFirebaseServiceProvider;
      this.expenseFirebaseDbProdiver = expenseFirebaseServiceProvider;
    }
   
  }

  private parseBoolean(strVal) {
    if(strVal==="true"){
      return true;
    }
    return false;
  }

}
