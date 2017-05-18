import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';
import { ExpenseModel } from "../shared/shared-models";
import { ExpenseSqlServiceProviderInterface } from "../shared/shared-interfaces";


@Injectable()
export class ExpenseSqlServiceProvider implements ExpenseSqlServiceProviderInterface {
  db: SQLite;

  constructor(public http: Http) {
    this.db = new SQLite();
  }

  doesTableExist(callbackMethod) {
    this.db.openDatabase({
        name: 'data.db',
        location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT count(*) as recCount FROM sqlite_master WHERE name='Expense'",[]).then((data) => {
        var result : boolean = parseInt(data.rows.item(0).recCount) > 0;
        callbackMethod({success: true, data: result});
      }, (err) => {
        callbackMethod({success: false, data: err});
      });
      }, (err) => {
      callbackMethod({success: false, data: err});
    });

  }

  initialiseTable(callbackMethod) {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql('CREATE TABLE IF NOT EXISTS Expense(id INTEGER PRIMARY KEY AUTOINCREMENT, year NUMERIC, month TEXT, categoryId NUMERIC, expenseValue NUMERIC, recordDate TEXT, inSync NUMERIC)', {}).then((data) => {
        callbackMethod({success: true, data: data.rows.item(0)});
      }, (err) => {
        callbackMethod({success: false, data: err});

      });
    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  insertRecord(expenseModel: ExpenseModel, callbackMethod) {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql('INSERT INTO Expense (year, month, categoryId, expenseValue, recordDate, inSync) VALUES (?, ?, ?, ?, ?, ?)'
      , [
          expenseModel.year,
          expenseModel.month,
          expenseModel.categoryId, 
          expenseModel.expenseValue, 
          expenseModel.recordDate, 
          this.boolToNum(expenseModel.inSync)
        ]).then((data) => {
        callbackMethod({success: true, data: data});
      }, (err) => {
        callbackMethod({success: false, data: err});
      });

    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  updateRecord(expenseModel: ExpenseModel, callbackMethod) {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
        // WORK

        let sql = "UPDATE Expense SET year = " + expenseModel.year + ", month = '" + expenseModel.month + "', categoryId = '" + expenseModel.categoryId + "', expenseValue = " + expenseModel.expenseValue + ", recordDate = '" + expenseModel.recordDate + "', inSync = " + this.boolToNum(expenseModel.inSync) + " WHERE id = " + expenseModel.id;
        this.db.executeSql(sql, {}).then((data) => {
          callbackMethod({success: true, data: data});
        }, (err) => {
          callbackMethod({success: false, data: err});
        });
      }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  getRecord(id, callbackMethod) {
    let result: any = {};

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Expense WHERE id =" + id ,[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result = {
                  id: data.rows.item(i).id,
                  year: data.rows.item(i).year,
                  month: data.rows.item(i).month,
                  categoryId: data.rows.item(i).categoryId,
                  expenseValue: data.rows.item(i).expenseValue,
                  recordDate: data.rows.item(i).recordDate,
                  inSync: this.numToBool(data.rows.item(i).inSync),
                };
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


  getAllInPeriod(year:number, month:string, callbackMethod) {
    let result: ExpenseModel[] = [];

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Expense WHERE year=" + year + " AND month='" + month + "'",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  year: data.rows.item(i).year,
                  month: data.rows.item(i).month,
                  categoryId: data.rows.item(i).categoryId,
                  expenseValue: data.rows.item(i).expenseValue,
                  recordDate: data.rows.item(i).recordDate,
                  inSync: this.numToBool(data.rows.item(i).inSync),
                });
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

  getAll(callbackMethod) {
    let result: ExpenseModel[] = [];

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Expense",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  year: data.rows.item(i).year,
                  month: data.rows.item(i).month,
                  categoryId: data.rows.item(i).categoryId,
                  expenseValue: data.rows.item(i).expenseValue,
                  recordDate: data.rows.item(i).recordDate,
                  inSync: this.numToBool(data.rows.item(i).inSync),
                });
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

  deleteRecord(id: number, callbackMethod){
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("DELETE FROM Expense WHERE id=" + id,[]).then((data) => {
        callbackMethod({success: true, data: data});
      }, (err) => {
        callbackMethod({success: false, data: err});
      });

      }, (err) => {
      callbackMethod({success: false, data: err});
    });

  }

  syncTable(expenseModels: ExpenseModel[], callbackMethod){
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql('DELETE FROM Expense', {}).then((data) => {} , (err) => {
        callbackMethod({success: false, data: err}); 
        return;
      });

      for(var index = 0; index < expenseModels.length; index++){
        let budgetSetupModel = expenseModels[index];  

        this.db.executeSql('INSERT INTO Expense (year, month, categoryId, expenseValue, recordDate, inSync) VALUES (?, ?, ?, ?, ?, ?)'
        , [
            budgetSetupModel.categoryId, 
            budgetSetupModel.expenseValue,
            budgetSetupModel.recordDate,
            1
          ]).then((data) => {
            //callbackMethod({success: true, data: data});
          }, (err) => {
            callbackMethod({success: false, data: err});
            return;
          });

      }
      callbackMethod({success: true, data: 'OK'});
    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  getAllNonSyncedRecords(callbackMethod){
    let result: ExpenseModel[] = [];

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Expense WHERE inSync = 0",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  year: data.rows.item(i).year,
                  month: data.rows.item(i).month,
                  categoryId: data.rows.item(i).categoryId,
                  expenseValue: data.rows.item(i).expenseValue,
                  recordDate: data.rows.item(i).recordDate,
                  inSync: this.numToBool(data.rows.item(i).inSync),
                });
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

  boolToNum(boolVal: boolean){
    if(boolVal === true){
      return 1;
    }
    return 0;
  }

  numToBool(numValue: number){
    if(numValue === 0){
      return false;
    }
    return true;
  }

}
