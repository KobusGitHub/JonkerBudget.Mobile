import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage, SqlitePage, BudgetListPage, TempPage, SetMonthPage, ReportPage, SyncPage, NetReportPage } from '../shared/shared-pages';
import { DatabaseSqlServiceProvider, UserSqlServiceProvider, MockUserSqlServiceProvider,
    CategorySqlServiceProvider, MockCategorySqlServiceProvider, 
    ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
    SqliteSqlServiceProvider, ToastProvider, ExpenseApi, CategoryApi, SyncServiceProvider, ServicePackProvider, CallbackMangerServiceProvider } from '../shared/shared-providers'

import { SqliteCallbackModel } from '../shared/shared-models';

@Component({
  templateUrl: 'app.html',
  providers: [DatabaseSqlServiceProvider, UserSqlServiceProvider, MockUserSqlServiceProvider, 
            CategorySqlServiceProvider, MockCategorySqlServiceProvider,
            ExpenseSqlServiceProvider, MockExpenseSqlServiceProvider,
      SqliteSqlServiceProvider, ToastProvider, ExpenseApi, CategoryApi, SyncServiceProvider, ServicePackProvider]
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    showedExitAlert = false;

    rootPage: any = TempPage;

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

    pages: Array<{title: string, component: any}>;

    constructor(public alert: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
        private databaseSqlServiceProvider: DatabaseSqlServiceProvider,
        public loading: LoadingController,
        public events: Events,
        private toast: ToastProvider,
        private servicePack: ServicePackProvider) {
        this.initializeApp();
        
        
        this.showAdvancedOptions = false;

        localStorage.setItem('browserMode', 'false');  
        

        if (localStorage.getItem("ServicePack") === undefined || localStorage.getItem("ServicePack") === null) {
            localStorage.setItem('ServicePack', '0');
        }
        this.servicePackValue = localStorage.getItem("ServicePack");

        if (localStorage.getItem("useAPI") === undefined || localStorage.getItem("useAPI") === null)
        {
            localStorage.setItem('useAPI', 'true'); 
        }

        if (localStorage.getItem("useAPI") === 'true'){
            this.useAPI = true;
        } else {
            this.useAPI = false;
        }

        if (localStorage.getItem("offlineOnly") === undefined || localStorage.getItem("offlineOnly") === null) {
            localStorage.setItem('offlineOnly', 'false');
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

        this.callbackManager = new CallbackMangerServiceProvider();
        this.callbackManager.add('doesTableExistCallback');
        this.loader = this.loading.create({ 
            content: 'Checking Database, please wait...', 
        }); 
        this.loader.present().then(() => {
            this.databaseSqlServiceProvider.userDbProvider.doesTableExist(e => this.doesTableExistCallback(e)); 
        });
    }

    doesTableExistCallback(result: SqliteCallbackModel){
        
        if(result.success && !result.data) {
            this.loader.setContent('Checking system, please wait...');
            this.buildDatabase();
            this.callbackManager.removeCheckDismiss('doesTableExistCallback', this.loader);
            
        } else {
            this.callbackManager.add('checkServicePackCallback');
            this.callbackManager.removeCheckDismiss('doesTableExistCallback',this.loader);
            this.loader.setContent('Installing service packs, please wait...');
            this.servicePack.checkServicePack(e => this.checkServicePackCallback(e));
        }
    }

    checkServicePackCallback(result: SqliteCallbackModel) {
        this.callbackManager.removeCheckDismiss('checkServicePackCallback', this.loader);
        if(result.success === false){
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
    
    initialiseUserTableCallback(result: SqliteCallbackModel){
        if(result.success) {
            if (this.callbackManager.removeCheckDismiss('initialiseUserTableCallback', this.loader) === true){
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

    initialiseBudgetSetupTableCallback(result: SqliteCallbackModel){
        if(result.success) {
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

    initialiseExpenseTableCallback(result: SqliteCallbackModel){
        if(result.success) {
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

    insertUserCallback(result: SqliteCallbackModel){
        if(result.success) {
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
