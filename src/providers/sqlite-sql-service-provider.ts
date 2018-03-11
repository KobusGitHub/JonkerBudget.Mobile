import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the ToolsSqlProviderTs provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SqliteSqlServiceProvider {
  private options = { name: "data.db", location: 'default', createFromLocation: 1 };

  constructor(public http: Http, private sqlite: SQLite) {
   
  }

  executeSql(sqlStatement, callbackMethod): any {
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql(sqlStatement, {}).then((data) => {
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
