import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';
import { CategoryModel } from "../shared/shared-models";
import { CategorySqlServiceProviderInterface } from "../shared/shared-interfaces";


@Injectable()
export class CategorySqlServiceProvider implements CategorySqlServiceProviderInterface {
  db: SQLite;

  constructor(public http: Http) {
    this.db = new SQLite();
  }

  doesTableExist(callbackMethod) {
    this.db.openDatabase({
        name: 'data.db',
        location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT count(*) as recCount FROM sqlite_master WHERE name='Category'",[]).then((data) => {
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

      this.db.executeSql('CREATE TABLE IF NOT EXISTS Category(id INTEGER PRIMARY KEY AUTOINCREMENT, guidId TEXT, categoryName TEXT, budget NUMERIC, inSync NUMERIC)', {}).then((data) => {
        callbackMethod({success: true, data: data.rows.item(0)});
      }, (err) => {
        callbackMethod({success: false, data: err});

      });
    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  insertRecord(categoryModel: CategoryModel, callbackMethod) {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql('INSERT INTO Category (guidId, categoryName, budget, inSync) VALUES (?, ?, ?, ?)'
      , [
          categoryModel.guidId,
          categoryModel.categoryName, 
          categoryModel.budget, 
          this.boolToNum(categoryModel.inSync)
        ]).then((data) => {
        callbackMethod({success: true, data: data});
      }, (err) => {
        callbackMethod({success: false, data: err});
      });

    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  updateRecord(categoryModel: CategoryModel, callbackMethod) {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
        // WORK

        let sql = "UPDATE Category SET guidId = '" + categoryModel.guidId + "', categoryName = '" + categoryModel.categoryName + "', budget = " + categoryModel.budget + ",  inSync = " + this.boolToNum(categoryModel.inSync) + " WHERE id = " + categoryModel.id;
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

      this.db.executeSql("SELECT * FROM Category WHERE id =" + id ,[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result = {
                  id: data.rows.item(i).id,
                  guidId: data.rows.item(i).guidId,
                  categoryName: data.rows.item(i).categoryName,
                  budget: data.rows.item(i).budget,
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

   getRecordByGuidId(guidId, callbackMethod) {
    let result: any = {};

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Category WHERE guidId = '" + guidId + "'" ,[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result = {
                  id: data.rows.item(i).id,
                  guidId: data.rows.item(i).guidId,
                  categoryName: data.rows.item(i).categoryName,
                  budget: data.rows.item(i).budget,
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


  getAll(callbackMethod) {
    let result: CategoryModel[] = [];

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Category ORDER BY categoryName",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  guidId: data.rows.item(i).guidId,
                  categoryName: data.rows.item(i).categoryName,
                  budget: data.rows.item(i).budget,
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

      this.db.executeSql("DELETE FROM Category WHERE id=" + id,[]).then((data) => {
        callbackMethod({success: true, data: data});
      }, (err) => {
        callbackMethod({success: false, data: err});
      });

      }, (err) => {
      callbackMethod({success: false, data: err});
    });

  }

  syncTable(budgetSetupModels: CategoryModel[], callbackMethod){
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql('DELETE FROM Category', {}).then((data) => {} , (err) => {
        callbackMethod({success: false, data: err}); 
        return;
      });

      for(var index = 0; index < budgetSetupModels.length; index++){
        let categoryModel = budgetSetupModels[index];  

        this.db.executeSql('INSERT INTO Category (guidId, categoryName, budget, inSync) VALUES (?, ?, ?, ?)'
        , [
            categoryModel.categoryName, 
            categoryModel.budget,
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
    let result: CategoryModel[] = [];

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Category WHERE inSync = 0",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  guidId: data.rows.item(i).guidId,
                  categoryName: data.rows.item(i).categoryName,
                  budget: data.rows.item(i).budget,
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
