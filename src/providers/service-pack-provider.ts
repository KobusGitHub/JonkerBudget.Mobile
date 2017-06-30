import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { SqliteSqlServiceProvider, CallbackMangerServiceProvider, ToastProvider } from '../shared/shared-providers';
import { SqliteCallbackModel } from '../shared/shared-models';

@Injectable()
export class ServicePackProvider {
    latestServicePack: number;
    callbackMethod;
    callbackManager: CallbackMangerServiceProvider;

    constructor(public toast: ToastProvider, private sqliteSqlServiceProvider: SqliteSqlServiceProvider) {
    }

    public checkServicePack(callbackMethod) {
        if (localStorage.getItem('browserMode') === 'true'){
            callbackMethod({ success: false, data: 'Service packs not for browser mode' })
            return;
        }

        this.callbackMethod = callbackMethod;


    
        this.latestServicePack = parseInt(localStorage.getItem("ServicePack"));

        this.callbackManager = new CallbackMangerServiceProvider();
        this.callbackManager.add('1');
        this.servicePack1('1');

        //callbackMethod({ success: true, data: 'Service Pack up to date' });
    }

    private servicePack1(sp){
        if (this.latestServicePack !== 0){
            if(this.callbackManager.removeCheck(sp)){
                this.callbackMethod({ success: true, data: 'Service Pack up to date' });
            }
            return;
        }

        let sql = 'ALTER TABLE Expense ADD Comment TEXT;';
        this.execute(sql, sp);
    }

    execute(sqlStatement, sp) {
        this.sqliteSqlServiceProvider.executeSql(sqlStatement, e => this.executeSqlCallback(e, sp));
    }

    executeSqlCallback(res: SqliteCallbackModel, sp) {
        if (res.success) {
            localStorage.setItem('ServicePack', sp);
            this.latestServicePack = sp;

            if (this.callbackManager.removeCheck(sp)) {
                this.callbackMethod({ success: true, data: 'Service Pack up to date' });
            }
            return;
        }
        this.callbackManager.removeCheck(sp);
        this.callbackMethod({ success: false, data: 'Error executing service pack: ' + sp });
        
    }


}