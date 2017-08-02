import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastProvider } from '../../providers/toast-service-provider';
import { HomePage } from '../../shared/shared-pages';

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
  income: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastProvider) {
    this.selectedYear = parseInt(localStorage.getItem('budgetYear')),
    this.selectedMonth = localStorage.getItem('budgetMonth')
    this.income = parseFloat(localStorage.getItem('budgetIncome'))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetMonth');
  }

  saveClick(){
    localStorage.setItem('budgetMonth', this.selectedMonth);
    localStorage.setItem('budgetYear', this.selectedYear.toString());
    localStorage.setItem('budgetIncome', this.income.toString());

    this.toast.showToast("Saved Successfully");

    this.navCtrl.setRoot(HomePage);
  }

}
