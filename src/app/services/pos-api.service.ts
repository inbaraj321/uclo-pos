import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PosApiService {

  constructor(private root:RootService, private http: HttpClient) { }

  get_taxtypes(){
    return this.http.get<any>(this.root.BASE_URL + 'Pos/get_taxtypes/' + this.root.getCompanyData()['COUNTRY_CODE'])
      .toPromise()
      .then(data => { return data; });
  }

  get_paymentInsertID(){
    return this.http.get<any>(this.root.BASE_URL + 'Pos/get_paymentInsertID')
      .toPromise()
      .then(data => { return data; });
  }

  get_allSales(){
    return this.http.get<any>(this.root.BASE_URL + 'Pos/get_allSales/' + this.root.getUserData()['UI_PKEY'])
      .toPromise()
      .then(data => { return data; });
  }

  get_allSalesDraft(){
    return this.http.get<any>(this.root.BASE_URL + 'Pos/get_allSalesDraft/' + this.root.getUserData()['UI_PKEY'])
      .toPromise()
      .then(data => { return data; });
  }

  update_Dpayment(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'Pos/update_payment', data)
      .toPromise()
      .then(data => { return data; });
  }

  delete_Dpayment(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'Pos/delete_Dpayment', data)
      .toPromise()
      .then(data => { return data; });
  }

  create_payment(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'Pos/create_payment', data)
      .toPromise()
      .then(data => { return data; });
  }

  addReturn(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'Pos/addReturn', data)
      .toPromise()
      .then(data => { return data; });
  }

  update_payment(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'Pos/make_payment', data)
      .toPromise()
      .then(data => { return data; });
  }

  get_searchbyInvoiceIdGino(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'Pos/get_searchbyInvoiceIdGino', data)
      .toPromise()
      .then(data => { return data; });
  }


  get_PrintInvoiceData($data = ''){
    return this.http.get<any>(this.root.BASE_URL + 'Pos/get_PrintInvoiceData/' + $data)
      .toPromise()
      .then(data => { return data; });
  }

  get_SalesReturnList($data = ''){
    return this.http.get<any>(this.root.BASE_URL + 'Pos/get_SalesReturnList/')
      .toPromise()
      .then(data => { return data; });
  }

  get_InvoiceIdGino($data = ''){
    return this.http.get<any>(this.root.BASE_URL + 'Pos/get_InvoiceIdGino/')
      .toPromise()
      .then(data => { return data; });
  }

  get_dashboardData($data = ''){
    return this.http.get<any>(this.root.BASE_URL + 'Pos/get_dashboardData/')
      .toPromise()
      .then(data => { return data; });
  }
}
