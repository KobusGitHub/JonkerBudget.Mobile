import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage, ListPage, SetupPage, SqlitePage, BudgetListPage, TempPage, SetMonthPage, ReportPage, SyncPage, NetReportPage } from '../shared/shared-pages';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MenuHeaderComponent, NoMenuHeaderComponent, TrackBudgetComponent, CurrencyFormatterComponent } from '../shared/shared-components';

@NgModule({
  declarations: [
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
    MenuHeaderComponent,
    NoMenuHeaderComponent,
    TrackBudgetComponent,
    CurrencyFormatterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule, // Newly add for ionic 3
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
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
    MenuHeaderComponent,
    NoMenuHeaderComponent,
    TrackBudgetComponent,
    CurrencyFormatterComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
