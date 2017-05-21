import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage, SqlitePage, BudgetListPage, TempPage, SetMonthPage, ReportPage, SyncPage } from '../shared/shared-pages';
import { DatabaseSqlServiceProvider, UserSqlServiceProvider, MockUserSqlServiceProvider,
    CategorySqlServiceProvider, MockCategorySqlServiceProvider, 
    ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
    SqliteSqlServiceProvider, ToastProvider, ExpenseApi } from '../shared/shared-providers'

import { SqliteCallbackModel } from '../shared/shared-models';

@Component({
  templateUrl: 'app.html',
  providers: [DatabaseSqlServiceProvider, UserSqlServiceProvider, MockUserSqlServiceProvider, 
            CategorySqlServiceProvider, MockCategorySqlServiceProvider,
            ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
            SqliteSqlServiceProvider, ToastProvider, ExpenseApi]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TempPage;

  private homePage;
  private sqlitePage;
  private budgetListPage;
  private setMonthPage;
  private reportPage; 
  private syncPage;

  loader: any;
  usersInit: boolean = false;
  budgetSetupInit: boolean = false;
  recordsCreated: boolean = false;
  expenseInit: boolean = false;

  //categoryRecCount = 39;
  categoryRecCount = 0;


  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
    private databaseSqlServiceProvider: DatabaseSqlServiceProvider,
    public expenseDbProvider:ExpenseSqlServiceProvider, 
    public loading: LoadingController,
    private toast: ToastProvider) {
    this.initializeApp();

    localStorage.setItem('browserMode','false');  

    if(localStorage.getItem('budgetYear') === undefined ||  localStorage.getItem('budgetYear') === null){
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dt = new Date();

        localStorage.setItem('budgetYear', dt.getFullYear().toString());
        localStorage.setItem('budgetMonth', monthNames[dt.getMonth()]);    
    }

    this.homePage = HomePage;
    this.sqlitePage = SqlitePage;
    this.budgetListPage = BudgetListPage;
    this.setMonthPage = SetMonthPage;
    this.reportPage = ReportPage;
    this.syncPage = SyncPage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  navigatePage(p){
    this.nav.setRoot(p)
  }


  ngAfterViewInit() {
        this.loader = this.loading.create({ 
            content: 'Checking Database, please wait...', 
        }); 
        this.loader.present().then(() => {
          this.databaseSqlServiceProvider.userDbProvider.doesTableExist(e => this.doesTableExistCallback(e)); 
        });
  }

  doesTableExistCallback(result: SqliteCallbackModel){
      this.loader.dismiss();
      if(result.success && !result.data) {
          alert('Building Database');
          this.loader = this.loading.create({
              content: 'Checking system, please wait...',
          });
          this.loader.present().then(() => {
              this.usersInit = false;
              this.recordsCreated = false;
              this.buildDatabase();
          });
      } else {
          this.nav.setRoot(HomePage);
      }
      
  }

    buildDatabase() {
        this.databaseSqlServiceProvider.userDbProvider.initialiseTable(e => this.initialiseUserTableCallback(e));
        this.databaseSqlServiceProvider.categoryDbProvider.initialiseTable(e => this.initialiseBudgetSetupTableCallback(e));
        this.expenseDbProvider.initialiseTable(e => this.initialiseExpenseTableCallback(e));

        this.databaseSqlServiceProvider.userDbProvider.insertRecord({
            id: 0,
            name: 'Kobus',
            surname: 'Test',
            cellphone: "0823938798",
            email: 'jacobusjonker@gmail.com',
            password: 'Kobu$1',
            province: 'Gauteng',
            userType: 'Admin',
            inSync: false
        }, e => this.insertUserCallback(e));

        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Allan Gray', budget: 500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Audi', budget: 6232.84, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Boeta Klere', budget: 500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'City of Joburg', budget: 5000, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Dokter', budget: 2000, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'DSTV', budget: 844, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Gladys', budget: 4450, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'google music', budget: 60, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Home Owner Accociation', budget: 350, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Huis', budget: 13277, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Janien', budget: 1500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Janien Klere', budget: 500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Ruan', budget: 400, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'kamp', budget: 2500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Trinity', budget: 0, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'kids Courier', budget: 800, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Kaponda', budget: 1700, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Kobus', budget: 1500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Kobus Klere', budget: 500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Kruideniers', budget: 6000, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Lunch', budget: 800, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Maintenance', budget: 1500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Momentum', budget: 2321, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'MTN', budget: 143.99, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Naweek', budget: 2000, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Petrol', budget: 4000, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Polo', budget: 2382.13, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Random', budget: 3094, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Sanral', budget: 500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Santam', budget: 3094, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'SOS', budget: 360, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Spaar', budget: 2000, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Sport', budget: 250, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Swembad', budget: 300, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Telkom', budget: 860, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'uber', budget: 300, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Uiteet/Takeaways', budget: 1500, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Vodacom', budget: 438, inSync: false }, e => this.insertCategoryCallback(e));
        // this.databaseSqlServiceProvider.categoryDbProvider.insertRecord({ id: 0, categoryName: 'Pets', budget: 200, inSync: false }, e => this.insertCategoryCallback(e));
    }

    insertCategoryCallback(result: SqliteCallbackModel){
        if(result.success) {
            this.categoryRecCount = this.categoryRecCount - 1;
            if(this.categoryRecCount === 0)
            {
                this.toast.showToast('Inserted category records successfully');
            }
        }
    }
   
    initialiseUserTableCallback(result: SqliteCallbackModel){
        this.usersInit = true;
        if(result.success) {
            this.toast.showToast('Initialised users table successfully');
            if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
                this.loader.dismiss();
                this.nav.setRoot(HomePage);
            }
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));

        if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
            this.loader.dismiss();
            this.nav.setRoot(HomePage);
        }
    }

    initialiseBudgetSetupTableCallback(result: SqliteCallbackModel){
        this.budgetSetupInit = true;
        if(result.success) {
            this.toast.showToast('Initialised Budet Setup table successfully');
            if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
                this.loader.dismiss();
                this.nav.setRoot(HomePage);
            }
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));

        if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
            this.loader.dismiss();
            this.nav.setRoot(HomePage);
        }
    }

    initialiseExpenseTableCallback(result: SqliteCallbackModel){
        this.expenseInit = true;
        if(result.success) {
            this.toast.showToast('Initialised Expense table successfully');
            if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
                this.loader.dismiss();
                this.nav.setRoot(HomePage);
            }
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));

        if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
            this.loader.dismiss();
            this.nav.setRoot(HomePage);
        }
    }

     insertUserCallback(result: SqliteCallbackModel){
        this.recordsCreated = true;
        if(result.success) {
            this.toast.showToast('Insert users successfully');
            if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
                this.loader.dismiss();
                this.nav.setRoot(HomePage);
            }
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));
        if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
            this.loader.dismiss();
            this.nav.setRoot(HomePage);
        }
    }
  
}
