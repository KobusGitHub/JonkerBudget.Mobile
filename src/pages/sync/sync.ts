import { Component } from '@angular/core';
import { SyncServiceProvider } from '../../shared/shared-providers';


/**
 * Generated class for the Sync page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
})
export class SyncPage {
  constructor(private syncService: SyncServiceProvider) {
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Sync');
  }

  syncClick(){
    this.syncService.sync();
  }

 
}
