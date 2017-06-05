import { Component, Input } from '@angular/core';
import { SyncServiceProvider } from '../../shared/shared-providers';
import { Events, NavController } from 'ionic-angular';
import { HomePage } from '../../shared/shared-pages';
/*
  Generated class for the MenuHeader component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'menu-header',
  templateUrl: 'menu-header.html'
})
export class MenuHeaderComponent {

  @Input()
  headerText: string = '';
//text: string;
  useAPI: boolean = false;        

  constructor(public navCtrl: NavController, private syncService: SyncServiceProvider, private events: Events) {
    //this.text = 'Hello World';
    this.setUseApiValue();

    events.subscribe('UseApiChanged', (time) => {
      this.setUseApiValue();
    });

  

  }

  private setUseApiValue() {
    if (localStorage.getItem("useAPI") === 'true') {
      this.useAPI = true;
    } else {
      this.useAPI = false;
    }

  }

  syncClick(){
    this.syncService.sync(e => this.callback(e));
  }
  callback(data: any){
    this.navCtrl.setRoot(HomePage);
  }
}
