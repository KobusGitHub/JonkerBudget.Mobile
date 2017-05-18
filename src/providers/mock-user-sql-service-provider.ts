import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserModel, SqlMockTableModel } from "../shared/shared-models";
import { UserSqlServiceProviderInterface } from '../shared/shared-interfaces';
/*
  Generated class for the MockReportSqlServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MockUserSqlServiceProvider implements UserSqlServiceProviderInterface {
  tableName: string = 'Users';

  constructor(public http: Http) {
    console.log('Hello MockUsrSqlServiceProvider Provider');
  }

  doesTableExist(callbackMethod) {
    let tableExist = true;
    if(!localStorage.getItem(this.tableName)){
      tableExist = false;
    }
    callbackMethod({success: true, data: tableExist});
  }

  initialiseTable(callbackMethod) {
    var usersTable = {
      name: this.tableName,
      data: []
    }

    localStorage.setItem(this.tableName, JSON.stringify(usersTable));
    callbackMethod({success: true, data: usersTable});
  }

  insertRecord(userModel: UserModel, callbackMethod) {
    let result = this.insertRecordInternal(userModel, this.getTable());
    callbackMethod({success: true, data: result});
  }
  private insertRecordInternal(userModel: UserModel, table): any {
      var maxId = 0;
      if(table.data.length > 0) {
          var array = table.data;
          maxId = Math.max.apply(Math,array.map(function(o){return o.id;}))
      }
      userModel.id = maxId + 1;
      table.data.push(userModel);

      localStorage.setItem(this.tableName, JSON.stringify(table));
      return {insertId: userModel.id};
  }

  getRecord(id, callbackMethod) {
    var result = this.getRecordInternal(this.getTable(), id)
    callbackMethod({success: true, data: result});
  }
  private getRecordInternal(table, id): any {
    var resultData: any;
    
    table.data.forEach(row => {
        if(row.id === id) {
            resultData = row;
        }
    });
        
    return resultData;
  }

  getAll(callbackMethod) {
    var result = this.getAllInternal(this.getTable())
    callbackMethod({success: true, data: result});
  }
  private getAllInternal(table): any {
    return  table.data;
  }


  updateRecord(userModel: UserModel, callbackMethod) {
    var result = this.updateRecordInternal(this.getTable(), userModel);
    callbackMethod({success: true, data: result});
  }
  private updateRecordInternal(table, reportModel): any {
      let foundRow: UserModel = null;  
      table.data.forEach(row => {
          if(row.id === reportModel.id) {
            foundRow = row;
          }
      });

      var index = table.data.indexOf(foundRow);
      table.data.splice(index, 1);

      reportModel.id = foundRow.id;
      //table.data.push(reportModel);
      table.data.splice(index, 0, reportModel);

      console.log("Update");
      console.log(reportModel);
      localStorage.setItem(this.tableName, JSON.stringify(table));
      return reportModel;
  }

  private getTable(): SqlMockTableModel {
      var table: SqlMockTableModel = new SqlMockTableModel();
      table = JSON.parse(localStorage.getItem(this.tableName)) 
      return table;
  }

  deleteRecord(id: number, callbackMethod){
    var result = this.deleteRecordInternal(this.getTable(), id);
    callbackMethod({success: true, data: result});
  }

  private deleteRecordInternal(table, id): any {
     let foundRow: UserModel = null;  
      table.data.forEach(row => {
          if(row.id === id) {
            foundRow = row;
          }
      });
        
      var index = table.data.indexOf(foundRow);
      table.data.splice(index, 1);
      localStorage.setItem(this.tableName, JSON.stringify(table));
      return table;
  }
  


  syncTable(userModels: UserModel[], callbackMethod) {
    var result = this.syncTableInternal(this.getTable(), userModels);
    callbackMethod({success: true, data: result});
  }
  private syncTableInternal(table, userModels): any {
      
      table.data = [];
      table.data = userModels;

      localStorage.setItem(this.tableName, JSON.stringify(table));
      return "OK";
  }

  getAllNonSyncedRecords(callbackMethod){
    var result = this.getAllNonSyncedRecordsInternal(this.getTable());
    callbackMethod({success: true, data: result});
  }
  private getAllNonSyncedRecordsInternal(table): any {
    var resultData: UserModel[] = [];
    
    table.data.forEach(row => {
        if(!row.inSync) {
            resultData.push(row);
        }
    });
        
    return resultData;
      
  }


}
