import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {

  constructor(private root:RootService, private http: HttpClient) { }

  get_customerAll(){
    return this.http.get<any>(this.root.BASE_URL + 'Customer/get_customerAll')
      .toPromise()
      .then(data => { return data; });
  }

  getCustomerInsertID(){
    return this.http.get<any>(this.root.BASE_URL + 'Customer/get_customerInsertID')
      .toPromise()
      .then(data => { return data; });
  }

  create_Customer(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'Customer/create_customer', data)
      .toPromise()
      .then(data => { return data; });
  }

  update_Customer(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'Customer/update_Customer', data)
      .toPromise()
      .then(data => { return data; });
  }
}