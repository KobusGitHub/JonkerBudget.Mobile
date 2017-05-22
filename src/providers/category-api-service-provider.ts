import {Injectable }from '@angular/core';
import  {Http ,Headers,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {baseUrl} from '../shared/shared';

@Injectable()
export class CategoryApi {     
    private header:Headers;

    constructor(private http:Http) {
    }

     getHeaders() : any {
          this.header = new Headers();
          this.header.append('Content-Type', 'application/json');
          return this.header;
     }

    addCategory(data) : Observable<any> {
          return this.http.post(baseUrl + "/Categories/AddCategory",data, {headers: this.getHeaders()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.error || 'Server error'));
     }

    updateCategory(data) : Observable<any> {
         return this.http.put(baseUrl + "/Categories/UpdateCategory" , data,{headers: this.getHeaders()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     addCategories(data) : Observable<any[]> {
          return this.http.post(baseUrl + "/Categories/AddCategories",data, {headers: this.getHeaders()})
          .map((response: Response) => response)
          .catch((error:any) => Observable.throw(error.error || 'Server error'));
     }

     
     getCategories() : Observable<any[]> {
          return this.http.get(baseUrl + "/Categories/GetAllCategories", {headers: this.getHeaders()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.error || 'Server error'));
     }
    


}