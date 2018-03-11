import { Component, Input } from '@angular/core';

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

  constructor() {
    //this.text = 'Hello World';
  }

}
