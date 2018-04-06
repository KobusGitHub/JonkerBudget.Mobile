import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage, ListPage, SetupPage, SqlitePage, BudgetListPage, TempPage, SetMonthPage, 
  ReportPage, SyncPage, NetReportPage, ExpenseDetailPage, CategoryReportPage, ForecastPage } from '../shared/shared-pages';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Splash } from '../pages/splash/splash';
import { Delay } from '../pages/delay/delay';

import { MenuHeaderComponent, NoMenuHeaderComponent, TrackBudgetComponent, CurrencyFormatterComponent } from '../shared/shared-components';

import { SQLite } from '@ionic-native/sqlite';
import { EmailComposer } from '@ionic-native/email-composer';

// import { AngularFireModule } from "angularfire2";
// import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from './firebase.credentials';
// import { AngularFireDatabaseModule } from "angularfire2/database";
// import { AngularFireOfflineModule } from 'angularfire2-offline';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// firebase.initializeApp(FIREBASE_CONFIG)


@NgModule({
  declarations: [
    Splash,
    Delay,
    MyApp,
    HomePage,
    ListPage,
    SetupPage,
    SqlitePage,
    BudgetListPage,
    TempPage,
    SetMonthPage,
    ReportPage,
    SyncPage,
    NetReportPage,
    ExpenseDetailPage,
    CategoryReportPage,
    ForecastPage,
    MenuHeaderComponent,
    NoMenuHeaderComponent,
    TrackBudgetComponent,
    CurrencyFormatterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule, // Newly add for ionic 3
    IonicModule.forRoot(MyApp),
    // AngularFireModule.initializeApp(FIREBASE_CONFIG),
    // AngularFireDatabaseModule
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    //AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Splash,
    Delay,
    MyApp,
    HomePage,
    ListPage,
    SetupPage,
    SqlitePage,
    BudgetListPage,
    TempPage,
    SetMonthPage,
    ReportPage,
    SyncPage,
    NetReportPage,
    ExpenseDetailPage,
    CategoryReportPage,
    ForecastPage,
    MenuHeaderComponent,
    NoMenuHeaderComponent,
    TrackBudgetComponent,
    CurrencyFormatterComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    EmailComposer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
