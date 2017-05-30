import { Component, Input } from '@angular/core';

/**
 * Generated class for the CurrencyFormatter component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'currency-formatter',
  templateUrl: 'currency-formatter.html'
})
export class CurrencyFormatterComponent {

  @Input() numberToFormat: number;
  displayText: string;

  constructor() {
    this.displayText = 'R 0.00'
  }

  ngOnChanges(){
    this.displayText = 'R ' + this.numberToFormat.toLocaleString('en-US',{minimumFractionDigits: 2});
  }

}
