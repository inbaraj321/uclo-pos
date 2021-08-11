import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PosService {

  public selectedProduct: any[] = [];
  public AllProduct: any[] = [];
  
  
  constructor() { }

  destroyProduct(){
    this.selectedProduct = [];
  }

  selectProduct(item:any){
    var toalQty = 0;
    var toalMQty = 0;
    this.selectedProduct.filter(object => {
      if(object['item'] == item['item']){
        if(object['availableQty'] == item['sellingQty'] || parseFloat(object['availableQty']) < parseFloat(item['sellingQty'])){
          toalQty = 1;
        }
        if(object['maximumStackQuantity'] !== "0"){
          if( parseFloat(object['maximumStackQuantity']) == parseFloat(item['sellingQty']) || parseFloat(object['maximumStackQuantity']) < parseFloat(item['sellingQty'])){
            toalMQty = 1;
          }
        }
      }
    });

   if(toalQty == 1){
    return 'maxReachError';
   }
   if(toalMQty == 1){
    return 'maxSReachError';
   }

    var totalProduct = this.selectedProduct.filter(object => {
      if(object['item'] == item['item']){
        object['sellingQty'] = parseInt(object['sellingQty']) +  1;
        return object['item'] == item['item'];
      }
      else{
        return false;
      }
      
    });

    if(totalProduct.length == 0){
      item['sellingQty'] = 1;
      this.selectedProduct.push(JSON.parse(JSON.stringify(item)));
    } 
    return;
  }

  getselectedProducts(){
    return this.selectedProduct;
  }

  removeProduct(item:any){
    this.selectedProduct = this.selectedProduct.filter(function(items:any) { 
      return items.item !== item.item;  
    });
    return this.getselectedProducts();
  }
}
 