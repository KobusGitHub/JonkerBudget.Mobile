import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { UserSqlServiceProvider, MockUserSqlServiceProvider, 
  ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
  CategorySqlServiceProvider, MockCategorySqlServiceProvider, CategoryFirebaseServiceProvider} from '../shared/shared-providers';
import { CategorySqlServiceProviderInterface, ExpenseSqlServiceProviderInterface, UserSqlServiceProviderInterface } from '../shared/shared-interfaces';

@Injectable()
export class DatabaseSqlServiceProvider {
  
  categoryFirebaseDbProdiver: CategoryFirebaseServiceProvider;
  public userDbProvider: UserSqlServiceProviderInterface;
  public categoryDbProvider: CategorySqlServiceProviderInterface;
  public expenseDbProvider: ExpenseSqlServiceProviderInterface;

  constructor(private userSqlServiceProvider: UserSqlServiceProvider, 
              private mockUserSqlServiceProvider: MockUserSqlServiceProvider, 
              private categorySqlServiceProvider: CategorySqlServiceProvider,
              private mockCategorySqlServiceProvider: MockCategorySqlServiceProvider,
              private expenseSqlServiceProvider: ExpenseSqlServiceProvider,
              private mockExpenseSqlServiceProvider: MockExpenseSqlServiceProvider,
            private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider) {

    if(this.parseBoolean(localStorage.getItem("browserMode"))) {
      this.userDbProvider = mockUserSqlServiceProvider;
      this.categoryDbProvider = mockCategorySqlServiceProvider; // TODO
      this.expenseDbProvider = mockExpenseSqlServiceProvider;
    } else {
      this.userDbProvider = userSqlServiceProvider;
      this.categoryDbProvider = categorySqlServiceProvider;
      this.expenseDbProvider = expenseSqlServiceProvider;
      this.categoryFirebaseDbProdiver = categoryFirebaseServiceProvider;
    }
   
  }

  private parseBoolean(strVal) {
    if(strVal==="true"){
      return true;
    }
    return false;
  }

}
