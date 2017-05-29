import {Injectable }from '@angular/core';
import  {Http ,Headers,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {baseUrl} from '../shared/shared';

@Injectable()
export class ExpenseApi {     
    private header:Headers;

    constructor(private http:Http) {
    }

     getHeaders() : any {
          this.header = new Headers();
          this.header.append('Content-Type', 'application/json');
          return this.header;
     }

    addExpense(data) : Observable<any> {
          return this.http.post(baseUrl + "/Expenses/AddExpense",data, {headers: this.getHeaders()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.error || 'Server error'));
     }

     addExpenses(data) : Observable<any[]> {
          return this.http.post(baseUrl + "/Expenses/AddExpenses",data, {headers: this.getHeaders()})
          .map((response: Response) => response)
          .catch((error:any) => Observable.throw(error.error || 'Server error'));
     }

    

     getExpenses(year: number, month:string) : Observable<any[]> {
          return this.http.get(baseUrl + "/Expenses/GetMonthExpenses?year=" + year + "&month=" + month, {headers: this.getHeaders()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.error || 'Server error'));
     }
    


}