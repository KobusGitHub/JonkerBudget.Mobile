import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController} from 'ionic-angular';
import { OnesignalServiceProvider, ToastProvider } from '../../shared/shared-providers';
import { SqliteCallbackModel } from '../../shared/shared-models';
/**
 * Generated class for the PushNotificationSetup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-push-notification-setup',
  templateUrl: 'push-notification-setup.html',
})
export class PushNotificationSetupPage {
  myPlayerId: string;
  friendsPlayerIds: string[] = [];
  newPlayerId: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private onesignalServiceProvider: OnesignalServiceProvider, private toast: ToastProvider) {
    this.myPlayerId = '';
    this.newPlayerId = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PushNotificationSetup');
    this.getMyPlayerId();
    this.loadFriendPlayerIds();
  }


  getMyPlayerId() {
    this.onesignalServiceProvider.getMyPlayerId(e => this.getPlayerCallback(e));
  }
  getPlayerCallback(data){
    this.myPlayerId = data.playerId
  }

  loadFriendPlayerIds(){
    this.friendsPlayerIds = JSON.parse(localStorage.getItem('friendsPlayerIds')) 
  }

  addFriendPlayerId(){
    this.friendsPlayerIds.push(this.newPlayerId);
    localStorage.setItem('friendsPlayerIds', JSON.stringify(this.friendsPlayerIds));
    this.newPlayerId = '';
  }

  removeFriendPlayerId(playerId){
    var index = this.friendsPlayerIds.indexOf(playerId);
    this.friendsPlayerIds.splice(index, 1);
    localStorage.setItem('friendsPlayerIds', JSON.stringify(this.friendsPlayerIds));
  }

  sendClick(){
    if(this.friendsPlayerIds.length === 0){
      alert('No friends added');
      return;
    }

    this.onesignalServiceProvider.sendNotification(this.friendsPlayerIds, 'MyHeader', 'MyMessage', { name: 'kobus', notificationTaskId: 1 })
      .subscribe(
      res => {
        alert("message sent");
      },
      err => {
        alert(err.message);
        return;
      }
      ); 
  }

}
