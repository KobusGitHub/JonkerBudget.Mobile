import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';

/*
  Generated class for the ToolsSqlProviderTs provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SqliteSqlServiceProvider {
  db: SQLite;

  constructor(public http: Http) {
    this.db = new SQLite();
  }

  executeSql(sqlStatement, callbackMethod): any {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql(sqlStatement, {}).then((data) => {
        var result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
        }
        callbackMethod({success: true, data: result});
      }, (err) => {
        callbackMethod({success: false, data: err});
        
      });
      
    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

}
