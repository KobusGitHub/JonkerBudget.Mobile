import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ExpenseModel, ExpenseApiModel } from "../shared/shared-models";
import { ExpenseSqlServiceProviderInterface } from "../shared/shared-interfaces";


@Injectable()
export class ExpenseSqlServiceProvider implements ExpenseSqlServiceProviderInterface {
  
  private options = { name: "data.db", location: 'default', createFromLocation: 1 };
  constructor(public http: Http, private sqlite: SQLite) {
    
  }

  doesTableExist(callbackMethod) {
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql("SELECT count(*) as recCount FROM sqlite_master WHERE name='Expense'",[]).then((data) => {
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
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS Expense(id INTEGER PRIMARY KEY AUTOINCREMENT, year NUMERIC, month TEXT, categoryGuidId TEXT, expenseValue NUMERIC, recordDate TEXT, expenseCode TEXT, comment TEXT, inSync NUMERIC)', {}).then((data) => {
        callbackMethod({success: true, data: data.rows.item(0)});
      }, (err) => {
        callbackMethod({success: false, data: err});

      });
    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  insertRecord(expenseModel: ExpenseModel, callbackMethod) {
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO Expense (year, month, categoryGuidId, expenseValue, recordDate, expenseCode, comment, inSync) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      , [
          expenseModel.year,
          expenseModel.month,
          expenseModel.categoryGuidId, 
          expenseModel.expenseValue, 
          expenseModel.recordDate,
          expenseModel.expenseCode, 
          expenseModel.comment,
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
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
     

      let sql = "UPDATE Expense SET year = " + expenseModel.year + ", month = '" + expenseModel.month + "', categoryGuidId = '" + expenseModel.categoryGuidId + "', expenseValue = " + expenseModel.expenseValue + ", recordDate = '" + expenseModel.recordDate + "', expenseCode = '" + expenseModel.expenseCode + "', comment = '" + expenseModel.comment + "', inSync = " + this.boolToNum(expenseModel.inSync) + " WHERE id = " + expenseModel.id;
        db.executeSql(sql, {}).then((data) => {
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

    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql("SELECT * FROM Expense WHERE id =" + id ,[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result = {
                  id: data.rows.item(i).id,
                  year: data.rows.item(i).year,
                  month: data.rows.item(i).month,
                  categoryGuidId: data.rows.item(i).categoryGuidId,
                  expenseValue: data.rows.item(i).expenseValue,
                  recordDate: data.rows.item(i).recordDate,
                  expenseCode: data.rows.item(i).expenseCode,
                  comment: data.rows.item(i).comment,
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

  getSumInPeriod(year: number, month: string, callbackMethod) {
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql("SELECT SUM(ExpenseValue) as sumExpense FROM Expense WHERE year=" + year + " AND month='" + month + "'", []).then((data) => {
       
        callbackMethod({ success: true, data: data.rows.item(0).sumExpense });
      }, (err) => {
        callbackMethod({ success: false, data: err });
      });

    }, (err) => {
      callbackMethod({ success: false, data: err });
    });
  }

  getAllInPeriod(year:number, month:string, callbackMethod) {
    let result: ExpenseModel[] = [];

    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql("SELECT * FROM Expense WHERE year=" + year + " AND month='" + month + "'",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  year: data.rows.item(i).year,
                  month: data.rows.item(i).month,
                  categoryGuidId: data.rows.item(i).categoryGuidId,
                  expenseValue: data.rows.item(i).expenseValue,
                  recordDate: data.rows.item(i).recordDate,
                  expenseCode: data.rows.item(i).expenseCode,
                  comment: data.rows.item(i).comment,
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

    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql("SELECT * FROM Expense",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  year: data.rows.item(i).year,
                  month: data.rows.item(i).month,
                  categoryGuidId: data.rows.item(i).categoryGuidId,
                  expenseValue: data.rows.item(i).expenseValue,
                  recordDate: data.rows.item(i).recordDate,
                  expenseCode: data.rows.item(i).expenseCode,
                  comment: data.rows.item(i).comment,
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
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql("DELETE FROM Expense WHERE id=" + id,[]).then((data) => {
        callbackMethod({success: true, data: data});
      }, (err) => {
        callbackMethod({success: false, data: err});
      });

      }, (err) => {
      callbackMethod({success: false, data: err});
    });

  }

  syncTable(year:number, month:string, expenseModels: ExpenseModel[], callbackMethod){
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql("DELETE FROM Expense WHERE year=" + year + " AND month='" + month + "'", {}).then((data) => {} , (err) => {
        callbackMethod({success: false, data: err}); 
        return;
      });

      for(var index = 0; index < expenseModels.length; index++){
        let budgetSetupModel = expenseModels[index];  

        db.executeSql('INSERT INTO Expense (year, month, categoryGuidId, expenseValue, recordDate, expenseCode, comment, inSync) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        , [
            budgetSetupModel.year, 
            budgetSetupModel.month,
            budgetSetupModel.categoryGuidId,
            budgetSetupModel.expenseValue,
            budgetSetupModel.recordDate,
            budgetSetupModel.expenseCode,
            budgetSetupModel.comment,
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

  getAllNonSyncedRecords(year:number, month:string, callbackMethod){
    let result: ExpenseApiModel[] = [];

    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      db.executeSql("SELECT * FROM Expense WHERE inSync = 0 AND year=" + year + " AND month='" + month + "'",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  year: data.rows.item(i).year,
                  month: data.rows.item(i).month,
                  categoryGuidId: data.rows.item(i).categoryGuidId,
                  expenseValue: data.rows.item(i).expenseValue,
                  recordDate: new Date(data.rows.item(i).recordDate),
                  expenseCode: data.rows.item(i).expenseCode,
                  comment: data.rows.item(i).comment,
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

  updateRecordsToSynced(uniqueCodes: string[], callbackMethod){
    let uniqueCodeCommaList = '';

    uniqueCodes.forEach(code => {
      if(uniqueCodeCommaList === ''){
        uniqueCodeCommaList = code
      } else {
        uniqueCodeCommaList = uniqueCodeCommaList + ',' + code
      }
    });
    
    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      

      let sql = "UPDATE Expense SET inSync = 1 WHERE uniqueCodes IN (" + uniqueCodeCommaList + ")";
      db.executeSql(sql, {}).then((data) => {
        callbackMethod({success: true, data: data});
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
