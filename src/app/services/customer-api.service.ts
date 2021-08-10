import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {

  constructor(private root:RootService, private http: HttpClient) { }

  get_customerAll(){
    debugger;
    return this.http.get<any>(this.root.BASE_URL + 'customer/get-customer-all')
    
      .toPromise()
      .then(data => { return data; });
      
  }

  getCustomerInsertID(){
    return this.http.get<any>(this.root.BASE_URL + 'customer/get-customer-insert-id')
      .toPromise()
      .then(data => { return data; });
  }

  create_Customer(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'customer/create-customer', data)
      .toPromise()
      .then(data => { return data; });
  }

  update_Customer(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'customer/update-customer', data)
      .toPromise()
      .then(data => { return data; });
  }
}
