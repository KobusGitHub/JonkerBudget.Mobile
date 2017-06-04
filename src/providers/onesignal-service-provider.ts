import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { OneSignalVars } from '../shared/shared-onesignal-vars';
import  {Http,Headers,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class OnesignalServiceProvider {;
  private header : Headers;
  private token : string;
     
  constructor(private platform: Platform, private http:Http) {
  }

  initializeOneSignal(){
    if(this.parseBoolean(localStorage.getItem("browserMode"))) {
      return;
    }

    this.platform.ready().then(() => {
    // Enable to debug issues.
    // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    window["plugins"].OneSignal
        .startInit(OneSignalVars.OneSignalAppId, OneSignalVars.SenderId)
        .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
        .handleNotificationOpened(this.notificationOpenedCallback)
        .handleNotificationReceived(this.notificationReceivedCallback)
        .endInit();
    });

    // NOTES
    //  In app.component add:
    //
    // ngAfterViewInit() {
    //   this.oneSignalServiceProvider.initializeOneSignalWithCallbacks(o => this.notificationOpenedCallback(o), r => this.notificationReceivedCallback(r));
    // }
    // private notificationOpenedCallback(jsonData){
    //   alert('jsonData.notification.payload.additionalData.YOUR_DATA_OBJECT_PROPERTY');
    // }
    // private notificationReceivedCallback(jsonData){
    //   alert('jsonData.notification.payload.additionalData.YOUR_DATA_OBJECT_PROPERTY');
    // }
  }


  initializeOneSignalWithCallbacks(notificationOpenedCallback, notificationReceivedCallback){
    if(this.parseBoolean(localStorage.getItem("browserMode"))) {
      return;
    }

    this.platform.ready().then(() => {
    // Enable to debug issues.
    // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    window["plugins"].OneSignal
        .startInit(OneSignalVars.OneSignalAppId, OneSignalVars.SenderId)
        .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
        .handleNotificationOpened(notificationOpenedCallback)
        .handleNotificationReceived(notificationReceivedCallback)
        .endInit();
    });

    // NOTES
    //  In app.component add:
    //
    //  ngAfterViewInit() {
    //    this.oneSignalServiceProvider.initializeOneSignal();
    //  }
  }



  sendNotification(playerIds: string[], heading: string, message: string, metaData: {}) : Observable<any> {
    if(this.parseBoolean(localStorage.getItem("browserMode"))) {
      return;
    }
    let notificationBody: any = {
      app_id: OneSignalVars.OneSignalAppId,
      include_player_ids: playerIds ,
      headings : {en: heading},
      data: metaData,
      contents: {en: message}
    }

    console.log(notificationBody);
    return  this.http.post(OneSignalVars.OneSignalUrl, notificationBody, {headers: this.getHeaders()})
      .map((response: Response) => response.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));


    // NOTES
    // this.onesignalServiceProvider.sendNotification(['3ecef147-0174-4aee-979d-8c0f7222e881'], 'Notification Header', 'This is my message', {name: 'kobus'})
    // .subscribe(
    //    res => {
    //         alert("message sent");
    //     },
    //     err => {
    //         alert(err.message);
    //         return;
    //     }
    // ); 
  }

  getMyPlayerId(callbackMethod): void {
    if(this.parseBoolean(localStorage.getItem("browserMode"))) {
      return;
    }

    if (localStorage.getItem('playerId') != undefined && localStorage.getItem('playerId') != null){
      callbackMethod({ playerId: localStorage.getItem('playerId') });
      return;
    }

    window["plugins"].OneSignal.getIds(function(ids) {
      localStorage.setItem('playerId', ids.userId);
      callbackMethod({playerId: ids.userId});
    });

   

    // // NOTES
    // //this.onesignalServiceProvider.getMyPlayerId(e => this.callback(e));
    // //
    // // callback(res){
    // //  alert(res.playerId);
    // // }
  }


  private notificationOpenedCallback(jsonData){
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  }
  
  private notificationReceivedCallback(jsonData){
    console.log('notificationReceivedCallback: ' + JSON.stringify(jsonData));
  }

  private getHeaders() : any {
      this.header = new Headers();
      this.token = 'Basic ' + OneSignalVars.RestApiKey;
      this.header.append('Authorization', this.token);
      this.header.append('Content-Type', 'application/json');
      return this.header;
  }

  private parseBoolean(strVal) {
    if(strVal==="true")
      return true;

      return false;
  }

  
}
