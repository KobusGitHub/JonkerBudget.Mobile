import { Component } from '@angular/core';
import { NavController, ViewController, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../../shared/shared-pages';
/**
 * Generated class for the Splash page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class Splash {

  constructor(private events: Events, public viewCtrl: ViewController, public navCtrl: NavController, public splashScreen: SplashScreen) {
  }

  ionViewDidEnter() {

    this.splashScreen.hide();

    setTimeout(() => {
      this.events.publish('dismissSplash', true);
      //this.viewCtrl.dismiss();
    }, 4000);

  }

}
