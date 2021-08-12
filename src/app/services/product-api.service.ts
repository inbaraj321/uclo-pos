import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  constructor(private root:RootService, private http: HttpClient) { }

  get_productsAll(){
    return this.http.get<any>(this.root.BASE_URL + 'product/get-products-all')
      .toPromise()
      .then(data => { return data; });
  }

  getProductInsertID(){
    return this.http.get<any>(this.root.BASE_URL + 'product/get-product-insert-id')
      .toPromise()
      .then(data => { return data; });
  }
  
  create_Product(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'product/create-product', data)
      .toPromise()
      .then(data => { return data; });
  }

  update_Product(data: any){
    return this.http.post<any>(this.root.BASE_URL + 'product/update-product', data)
      .toPromise()
      .then(data => { return data; });
  }
  
}
