import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage, SqlitePage, BudgetListPage, TempPage, SetMonthPage, ReportPage, SyncPage, NetReportPage } from '../shared/shared-pages';
import { DatabaseSqlServiceProvider, UserSqlServiceProvider, MockUserSqlServiceProvider,
    CategorySqlServiceProvider, MockCategorySqlServiceProvider, 
    ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
    SqliteSqlServiceProvider, ToastProvider, ExpenseApi, CategoryApi, SyncServiceProvider } from '../shared/shared-providers'

import { SqliteCallbackModel } from '../shared/shared-models';

@Component({
  templateUrl: 'app.html',
  providers: [DatabaseSqlServiceProvider, UserSqlServiceProvider, MockUserSqlServiceProvider, 
            CategorySqlServiceProvider, MockCategorySqlServiceProvider,
            ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
      SqliteSqlServiceProvider, ToastProvider, ExpenseApi, CategoryApi, SyncServiceProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  showedExitAlert = false;

  rootPage: any = TempPage;

  private useAPI: boolean = false;
  private offlineOnly: boolean = false;
  private showAdvancedOptions: boolean = false;

  private homePage;
  private sqlitePage;
  private budgetListPage;
  private setMonthPage;
  private reportPage; 
  private syncPage;
  private netReportPage;

  loader: any;
  usersInit: boolean = false;
  budgetSetupInit: boolean = false;
  recordsCreated: boolean = false;
  expenseInit: boolean = false;

  pages: Array<{title: string, component: any}>;

  constructor(public alert: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
    private databaseSqlServiceProvider: DatabaseSqlServiceProvider,
    public loading: LoadingController,
    public events: Events,
    private toast: ToastProvider) {
    this.initializeApp();
    
    this.showAdvancedOptions = false;

    localStorage.setItem('browserMode', 'false');  
    
    if (localStorage.getItem("useAPI") === undefined || localStorage.getItem("useAPI") === null)
    {
        localStorage.setItem('useAPI', 'false'); 
    }

    if (localStorage.getItem("useAPI") === 'true'){
        this.useAPI = true;
    } else {
        this.useAPI = false;
    }

    if (localStorage.getItem("offlineOnly") === undefined || localStorage.getItem("offlineOnly") === null) {
        localStorage.setItem('offlineOnly', 'true');
    }

    if (localStorage.getItem("offlineOnly") === 'true') {
        this.offlineOnly = true;
    } else {
        this.offlineOnly = false;
    }

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
    this.netReportPage = NetReportPage;

    this.platform.registerBackButtonAction(() => {
        if (this.nav.length() == 1) {
            if (!this.showedExitAlert) {
                this.confirmExitApp();
            } else {
                this.showedExitAlert = false;
            }
        }

        this.nav.pop();
    });

  }

  confirmExitApp() {
      this.showedExitAlert = true;
      let alert = this.alert.create({
          title: 'Confirm',
          message: 'Do you want to exit?',
          buttons: [{
              text: "Cancel",
              role: 'cancel',
              handler: () => {
                  this.showedExitAlert = false;
              }

          }, {
              text: "exit",
              handler: () => {
                  this.showedExitAlert = false;
                  this.exitApp();
              }
          }]
      })
      alert.present();
  }
  exitApp() {
      this.platform.exitApp();
  }

  useApiChange(){
      
      if (this.useAPI === true) {
          localStorage.setItem('useAPI', 'true');
      } else {
          localStorage.setItem('useAPI', 'false');
      }
      this.events.publish('UseApiChanged', Date.now());
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
        this.databaseSqlServiceProvider.expenseDbProvider.initialiseTable(e => this.initialiseExpenseTableCallback(e));

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
    }

    
   
    initialiseUserTableCallback(result: SqliteCallbackModel){
        this.usersInit = true;
        if(result.success) {
            this.toast.showToast('Initialised users table successfully');
            if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
                this.loader.dismiss();
                this.nav.setRoot(BudgetListPage);
            }
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));

        if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
            this.loader.dismiss();
            this.nav.setRoot(BudgetListPage);
        }
    }

    initialiseBudgetSetupTableCallback(result: SqliteCallbackModel){
        this.budgetSetupInit = true;
        if(result.success) {
            this.toast.showToast('Initialised Budet Setup table successfully');
            if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
                this.loader.dismiss();
                this.nav.setRoot(BudgetListPage);
            }
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));

        if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
            this.loader.dismiss();
            this.nav.setRoot(BudgetListPage);
        }
    }

    initialiseExpenseTableCallback(result: SqliteCallbackModel){
        this.expenseInit = true;
        if(result.success) {
            this.toast.showToast('Initialised Expense table successfully');
            if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
                this.loader.dismiss();
                this.nav.setRoot(BudgetListPage);
            }
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));

        if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
            this.loader.dismiss();
            this.nav.setRoot(BudgetListPage);
        }
    }

     insertUserCallback(result: SqliteCallbackModel){
        this.recordsCreated = true;
        if(result.success) {
            this.toast.showToast('Insert users successfully');
            if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
                this.loader.dismiss();
                this.nav.setRoot(BudgetListPage);
            }
            return;
        }
        console.log(result.data);
        this.toast.showToast('Error');
        alert(JSON.stringify(result.data));
        if(this.usersInit && this.budgetSetupInit && this.expenseInit && this.recordsCreated) {
            this.loader.dismiss();
            this.nav.setRoot(BudgetListPage);
        }
    }
  
}
