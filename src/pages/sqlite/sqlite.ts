import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SqliteSqlServiceProvider } from '../../shared/shared-providers';
import { SqliteCallbackModel } from '../../shared/shared-models';
import { ToastController } from 'ionic-angular';


/*
  Generated class for the Sqlite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sqlite',
  templateUrl: 'sqlite.html'
})
export class SqlitePage {
  sqlStatement: string = 'SELECT * FROM Users';
  sqlResult: any = {};
  sqlResultRows: any[] = [];
  
  constructor(public navCtrl: NavController, 
  public navParams: NavParams, 
  private sqliteSqlServiceProvider: SqliteSqlServiceProvider,
  public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SqlitePage');
  }

  execute() {
    this.sqliteSqlServiceProvider.executeSql(this.sqlStatement, e => this.executeSqlCallback(e));
  }

  executeSqlCallback(res: SqliteCallbackModel){
    this.sqlResultRows = [];
    if(res.success)
    {
      this.showToast('Execute successfully');
      this.sqlResultRows = res.data;
      return;
    }
    this.showToast('Error');
  }

   private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }
}
