import { Component, Input } from '@angular/core';

/*
  Generated class for the NoMenuHeader component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'no-menu-header',
  templateUrl: 'no-menu-header.html'
})
export class NoMenuHeaderComponent {

  @Input() headerText: string = '';

  constructor() {
    
  }

}
