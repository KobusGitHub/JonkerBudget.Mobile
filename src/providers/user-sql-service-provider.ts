import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';
import { UserModel } from "../shared/shared-models";
import { UserSqlServiceProviderInterface } from "../shared/shared-interfaces";


@Injectable()
export class UserSqlServiceProvider implements UserSqlServiceProviderInterface {
  db: SQLite;

  constructor(public http: Http) {
    this.db = new SQLite();
  }

  doesTableExist(callbackMethod) {
    this.db.openDatabase({
        name: 'data.db',
        location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT count(*) as recCount FROM sqlite_master WHERE name='Users'",[]).then((data) => {
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

      this.db.executeSql('CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, surname TEXT, cellphone TEXT, email TEXT, province TEXT, userType TEXT, password TEXT, inSync NUMERIC)', {}).then((data) => {
        callbackMethod({success: true, data: data.rows.item(0)});
      }, (err) => {
        callbackMethod({success: false, data: err});

      });
    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  insertRecord(userModel: UserModel, callbackMethod) {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql('INSERT INTO Users (name, surname, cellphone, email, province, userType, password, inSync) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      , [
          userModel.name, 
          userModel.surname, 
          userModel.cellphone, 
          userModel.email, 
          userModel.province, 
          userModel.userType, 
          userModel.password, 
           this.boolToNum(userModel.inSync)
        ]).then((data) => {
        callbackMethod({success: true, data: data});
      }, (err) => {
        callbackMethod({success: false, data: err});
      });

    }, (err) => {
      callbackMethod({success: false, data: err});
    });
  }

  updateRecord(userModel: UserModel, callbackMethod) {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
        // WORK

        let sql = "UPDATE Users SET name = '" + userModel.name + "', surname = '" + userModel.surname + "', cellphone = '" + userModel.cellphone + "',  email = '" + userModel.email + "', province = '" + userModel.province + "', userType = '" + userModel.userType + "', password = '" + userModel.password + "', inSync = " + this.boolToNum(userModel.inSync) + " WHERE id = " + userModel.id;
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

      this.db.executeSql("SELECT * FROM Users WHERE id =" + id ,[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result = {
                  id: data.rows.item(i).id,
                  name: data.rows.item(i).name,
                  surname: data.rows.item(i).surname,
                  cellphone: data.rows.item(i).cellphone,
                  email: data.rows.item(i).email,
                  province: data.rows.item(i).province,
                  userType: data.rows.item(i).userType,
                  password: data.rows.item(i).password,
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
    let result: UserModel[] = [];

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Users",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  name: data.rows.item(i).name,
                  surname: data.rows.item(i).surname,
                  cellphone: data.rows.item(i).cellphone,
                  email: data.rows.item(i).email,
                  province: data.rows.item(i).province,
                  userType: data.rows.item(i).userType,
                  password: data.rows.item(i).password,
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

      this.db.executeSql("DELETE FROM Users WHERE id=" + id,[]).then((data) => {
        callbackMethod({success: true, data: data});
      }, (err) => {
        callbackMethod({success: false, data: err});
      });

      }, (err) => {
      callbackMethod({success: false, data: err});
    });

  }

  syncTable(userModels: UserModel[], callbackMethod){
    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql('DELETE FROM Users', {}).then((data) => {} , (err) => {
        callbackMethod({success: false, data: err}); 
        return;
      });

      for(var index = 0; index < userModels.length; index++){
        let userModel = userModels[index];  

        this.db.executeSql('INSERT INTO Users (name, surname, cellphone, email, province, userType, password, inSync) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        , [
            userModel.name, 
            userModel.surname, 
            userModel.cellphone, 
            userModel.email, 
            userModel.province, 
            userModel.userType, 
            userModel.password, 
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
    let result: UserModel[] = [];

    this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {

      this.db.executeSql("SELECT * FROM Users WHERE inSync = 0",[]).then((data) => {
        result = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                result.push({
                  id: data.rows.item(i).id,
                  name: data.rows.item(i).name,
                  surname: data.rows.item(i).surname,
                  cellphone: data.rows.item(i).cellphone,
                  email: data.rows.item(i).email,
                  province: data.rows.item(i).province,
                  userType: data.rows.item(i).userType,
                  password: data.rows.item(i).password,
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
