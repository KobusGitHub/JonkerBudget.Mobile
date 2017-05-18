import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastProvider } from '../../providers/toast-service-provider';

/**
 * Generated class for the SetMonth page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-set-month',
  templateUrl: 'set-month.html',
})
export class SetMonthPage {

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  years = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027"];
  
  selectedMonth = '';
  selectedYear = 1900;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastProvider) {
    this.selectedYear = parseInt(localStorage.getItem('budgetYear')),
    this.selectedMonth = localStorage.getItem('budgetMonth')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetMonth');
  }

  saveClick(){
    localStorage.setItem('budgetMonth', this.selectedMonth);
    localStorage.setItem('budgetYear', this.selectedYear.toString());

    this.toast.showToast("Saved Successfully");
  }

}
