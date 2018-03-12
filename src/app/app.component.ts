import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController, ModalController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Splash } from '../pages/splash/splash';
import { Delay } from '../pages/delay/delay';

import { HomePage, SqlitePage, BudgetListPage, TempPage, SetMonthPage, ReportPage, SyncPage, NetReportPage } from '../shared/shared-pages';
import {
  DatabaseSqlServiceProvider, UserSqlServiceProvider, MockUserSqlServiceProvider,
  CategorySqlServiceProvider, MockCategorySqlServiceProvider,
  ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider, CategoryFirebaseServiceProvider,
  SqliteSqlServiceProvider, ToastProvider, ExpenseApi, CategoryApi, SyncServiceProvider, ServicePackProvider, CallbackMangerServiceProvider
} from '../shared/shared-providers'

import { SqliteCallbackModel } from '../shared/shared-models';


@Component({
  templateUrl: 'app.html',
  providers: [DatabaseSqlServiceProvider, UserSqlServiceProvider, MockUserSqlServiceProvider,
    CategorySqlServiceProvider, MockCategorySqlServiceProvider,
    ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
    CategoryFirebaseServiceProvider,
    SqliteSqlServiceProvider, ToastProvider, ExpenseApi, CategoryApi, SyncServiceProvider, ServicePackProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  showedExitAlert = false;
  splashModal: any;
  splashScreenDone = false;
  initalSetupDone = false;

  rootPage: any = Delay;

  private servicePackValue: string = '';
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

  callbackManager: CallbackMangerServiceProvider;
  loader: any;


  pages: Array<{ title: string, component: any }>;

  constructor(modalCtrl: ModalController,
    public alert: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private databaseSqlServiceProvider: DatabaseSqlServiceProvider,
    public loading: LoadingController,
    public events: Events,
    private toast: ToastProvider,
    private servicePack: ServicePackProvider) {

    events.subscribe('dismissSplash', (canDismiss) => {
      events.unsubscribe('dismissSplash');
      this.splashScreenDone = true;
      this.dismissModalAndNavigateWhenDone();
    });
    // Animaged Splash Screen
    platform.ready().then(() => {
      statusBar.styleDefault();
      this.splashModal = modalCtrl.create(Splash);
      this.splashModal.present();
    });


    this.initializeApp();

    let browserModeSetting = 'false';
    let useAPISetting = 'false';
    let offlineOnlySetting = 'true';


    this.showAdvancedOptions = false;

    localStorage.setItem('browserMode', browserModeSetting);


    if (localStorage.getItem("ServicePack") === undefined || localStorage.getItem("ServicePack") === null) {
      localStorage.setItem('ServicePack', '0');
    }
    this.servicePackValue = localStorage.getItem("ServicePack");

    if (localStorage.getItem("useAPI") === undefined || localStorage.getItem("useAPI") === null) {
      localStorage.setItem('useAPI', useAPISetting);
    }

    if (localStorage.getItem("useAPI") === 'true') {
      this.useAPI = true;
    } else {
      this.useAPI = false;
    }

    if (localStorage.getItem("offlineOnly") === undefined || localStorage.getItem("offlineOnly") === null) {
      localStorage.setItem('offlineOnly', offlineOnlySetting);
    }

    if (localStorage.getItem("offlineOnly") === 'true') {
      this.offlineOnly = true;
    } else {
      this.offlineOnly = false;
    }

    if (localStorage.getItem('budgetYear') === undefined || localStorage.getItem('budgetYear') === null) {
      let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let dt = new Date();

      localStorage.setItem('budgetYear', dt.getFullYear().toString());
      localStorage.setItem('budgetMonth', monthNames[dt.getMonth()]);
    }

    if (localStorage.getItem('budgetIncome') === undefined || localStorage.getItem('budgetIncome') === null) {
      localStorage.setItem('budgetIncome', '0');
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
          return;
        } else {
          this.showedExitAlert = false;
        }
      }
      this.nav.pop();
    });

  }

  dismissModalAndNavigateWhenDone() {
    if (this.splashScreenDone && this.initalSetupDone) {
      this.splashModal.dismiss();
      this.rootPage = HomePage;
    }
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

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
      this.initalSetupDone = true;
      this.dismissModalAndNavigateWhenDone();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  navigatePage(p) {
    this.nav.setRoot(p)
  }

  ngAfterViewInit() {

    this.callbackManager = new CallbackMangerServiceProvider();
    this.callbackManager.add('doesTableExistCallback');
    this.loader = this.loading.create({
      content: 'Checking Database, please wait...',
    });
    this.loader.present().then(() => {
      this.databaseSqlServiceProvider.userDbProvider.doesTableExist(e => this.doesTableExistCallback(e));
    });
  }

  doesTableExistCallback(result: SqliteCallbackModel) {

    if (result.success && !result.data) {
      this.loader.setContent('Checking system, please wait...');
      this.buildDatabase();
      this.callbackManager.removeCheckDismiss('doesTableExistCallback', this.loader);

    } else {
      this.callbackManager.add('checkServicePackCallback');
      this.callbackManager.removeCheckDismiss('doesTableExistCallback', this.loader);
      this.loader.setContent('Installing service packs, please wait...');
      this.servicePack.checkServicePack(e => this.checkServicePackCallback(e));
    }
  }

  checkServicePackCallback(result: SqliteCallbackModel) {
    this.callbackManager.removeCheckDismiss('checkServicePackCallback', this.loader);
    if (result.success === false) {
      alert(result.data);
    }
    this.nav.setRoot(HomePage);
  }

  buildDatabase() {
    localStorage.setItem('ServicePack', '1');
    this.callbackManager.add('initialiseUserTableCallback');
    this.callbackManager.add('initialiseBudgetSetupTableCallback');
    this.callbackManager.add('initialiseExpenseTableCallback');
    this.callbackManager.add('insertUserCallback');

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

  initialiseUserTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      if (this.callbackManager.removeCheckDismiss('initialiseUserTableCallback', this.loader) === true) {
        this.nav.setRoot(BudgetListPage);
      }
      return;
    }
    console.log(result.data);
    this.toast.showToast('Error');
    alert(JSON.stringify(result.data));

    if (this.callbackManager.removeCheckDismiss('initialiseUserTableCallback', this.loader) === true) {
      this.nav.setRoot(BudgetListPage);
    }
  }

  initialiseBudgetSetupTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      if (this.callbackManager.removeCheckDismiss('initialiseBudgetSetupTableCallback', this.loader) === true) {
        this.nav.setRoot(BudgetListPage);
      }
      return;
    }
    console.log(result.data);
    this.toast.showToast('Error');
    alert(JSON.stringify(result.data));

    if (this.callbackManager.removeCheckDismiss('initialiseBudgetSetupTableCallback', this.loader) === true) {
      this.nav.setRoot(BudgetListPage);
    }
  }

  initialiseExpenseTableCallback(result: SqliteCallbackModel) {
    if (result.success) {
      if (this.callbackManager.removeCheckDismiss('initialiseExpenseTableCallback', this.loader) === true) {
        this.nav.setRoot(BudgetListPage);
      }
      return;
    }
    console.log(result.data);
    this.toast.showToast('Error');
    alert(JSON.stringify(result.data));

    if (this.callbackManager.removeCheckDismiss('initialiseExpenseTableCallback', this.loader) === true) {
      this.nav.setRoot(BudgetListPage);
    }
  }

  insertUserCallback(result: SqliteCallbackModel) {
    if (result.success) {
      if (this.callbackManager.removeCheckDismiss('insertUserCallback', this.loader) === true) {
        this.nav.setRoot(BudgetListPage);
      }
      return;
    }
    console.log(result.data);
    this.toast.showToast('Error');
    alert(JSON.stringify(result.data));
    if (this.callbackManager.removeCheckDismiss('insertUserCallback', this.loader) === true) {
      this.nav.setRoot(BudgetListPage);
    }
  }
}
