import {Injectable }from '@angular/core';
import  {Http,Headers,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { baseUrl } from '../shared/shared';

/*
  Generated class for the UserApiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserApiServiceProvider {
  private token : string;
  private header : Headers;

  constructor(public http: Http) {
    
  }

  getHeaders() : any {
      this.header = new Headers();
      this.token = 'bearer ' + localStorage.getItem('token');
      this.header.append('Authorization', this.token);
      this.header.append('Content-Type', 'application/json');
      return this.header;
  }

  updatePlayerId(playerId) : Observable<any> {
      return this.http.put(baseUrl + "/Users/UpdatePlayerId?playerId=" + playerId , null, {headers: this.getHeaders()})
      .map((response: Response) => response.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
