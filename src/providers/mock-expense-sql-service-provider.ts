import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ExpenseModel, SqlMockTableModel } from "../shared/shared-models";
import { ExpenseSqlServiceProviderInterface } from '../shared/shared-interfaces';

/*
  Generated class for the MockExpenseSqlServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MockExpenseSqlServiceProvider implements ExpenseSqlServiceProviderInterface {
  tableName: string = 'Expense';

  constructor(public http: Http) {
    console.log('Hello MockExpenseSqlServiceProvider Provider');
  }

doesTableExist(callbackMethod) {
    let tableExist = true;
    if(!localStorage.getItem(this.tableName)){
      tableExist = false;
    }
    callbackMethod({success: true, data: tableExist});
  }

  initialiseTable(callbackMethod) {
    var budgetSetupTable = {
      name: this.tableName,
      data: []
    }


    localStorage.setItem(this.tableName, JSON.stringify(budgetSetupTable));
    callbackMethod({success: true, data: budgetSetupTable});
  }

  insertRecord(expenseModel: ExpenseModel, callbackMethod) {
    let result = this.insertRecordInternal(expenseModel, this.getTable());
    callbackMethod({success: true, data: result});
  }
  private insertRecordInternal(expenseModel: ExpenseModel, table): any {
      var maxId = 0;
      if(table.data.length > 0) {
          var array = table.data;
          maxId = Math.max.apply(Math,array.map(function(o){return o.id;}))
      }
      expenseModel.id = maxId + 1;
      table.data.push(expenseModel);

      localStorage.setItem(this.tableName, JSON.stringify(table));
      return {insertId: expenseModel.id};
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

  getAllInPeriod(year:number, month:string, callbackMethod){
    var result = this.getAllInPeriodInternal(this.getTable(), year, month)
    callbackMethod({success: true, data: result});
  }
  private getAllInPeriodInternal(table, year:number, month:string): any {
    var resultData: any = [];
    
    table.data.forEach(row => {
        if(row.year === year && row.month === month) {
            resultData.push(row);
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


  updateRecord(expenseModel: ExpenseModel, callbackMethod) {
    var result = this.updateRecordInternal(this.getTable(), expenseModel);
    callbackMethod({success: true, data: result});
  }
  private updateRecordInternal(table, reportModel): any {
      let foundRow: ExpenseModel = null;  
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
     let foundRow: ExpenseModel = null;  
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
  


  syncTable(year:number, month:string, expenseModels: ExpenseModel[], callbackMethod) {
    var result = this.syncTableInternal(this.getTable(), year, month, expenseModels);
    callbackMethod({success: true, data: result});
  }
  private syncTableInternal(table, year:number, month:string, userModels: ExpenseModel[]): any {
      for(let i = table.data.length -1; i >= 0; i--){
        let row = table.data[i];
        if(row.year === year && row.month === month){
          table.data.splice(i, 1);
        }
      }

      userModels.forEach(uModel => {
        uModel.inSync = true;
        table.data.push(uModel);
      });
      


      localStorage.setItem(this.tableName, JSON.stringify(table));
      return "OK";
  }

  getAllNonSyncedRecords(year:number, month:string, callbackMethod){
    var result = this.getAllNonSyncedRecordsInternal(this.getTable(), year, month);
    callbackMethod({success: true, data: result});
  }
  private getAllNonSyncedRecordsInternal(table, year:number, month:string): any {
    var resultData: ExpenseModel[] = [];
    
    table.data.forEach(row => {
        if(!row.inSync) {
            if(row.year === year && row.month === month){
              row.recordDate = new Date(row.recordDate),
              resultData.push(row);
            }
        }
    });
        
    return resultData;
      
  }

  updateRecordsToSynced(uniqueCodes: string[], callbackMethod){
    var result = this.updateRecordsToSyncedInternal(this.getTable(), uniqueCodes);
    callbackMethod({success: true, data: result});
    
  }

  updateRecordsToSyncedInternal(table, uniqueCodes:string[]){

    table.data.forEach(row => {
        if(!row.inSync) {
            row.inSync = true
        }
    });

    localStorage.setItem(this.tableName, JSON.stringify(table));
      return "OK";

  }

}

