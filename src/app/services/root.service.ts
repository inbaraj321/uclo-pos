import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';

declare var require: any
var moment = require('moment');

@Injectable({
  providedIn: 'root'
})
export class RootService {

  constructor() { }

  //BASE_URL = 'https://app-pos-sg.u-clo.com/api/';
  BASE_URL = 'http://192.168.18.16:9001/api/';
  BASE_IMG_URL = 'https://app-ae.u-clo.com/track/ReadFileServlet/?fileLocation=';

  getimageByUserUrl(image:any){
    if(image){
      return this.BASE_IMG_URL+image;
    }
    else{
      return 'https://app-ae.u-clo.com/track/jsp/images/trackNscan/nouser.png';
    }
  }
  getimageByUrl(image:any){
    if(image){
      return this.BASE_IMG_URL+image;
    }
    else{
      return './assets/img/profiles/l-1.jpg';
    }
  }

  returnAsCurrency(data:any){
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.getBaseCurrency(),
      minimumFractionDigits: this.getBaseDecimal()
    })

    return formatter.format(data) //parseFloat().toFixed(NUMBEROFDECIMAL);
  }

  returnWithdenomination(data:any){
    if(data == '' || data == null){
      var num:number = 0;
      return num.toFixed(this.getBaseDecimal());
    }
    return parseFloat(data).toFixed(this.getBaseDecimal());
  }

  getCompanyData(){
    var CompanyData: any =  localStorage.getItem('COMPANY_DATA');
    return JSON.parse(CompanyData);
  }

  getBaseCurrency(){
    var CompanyData: any =  localStorage.getItem('COMPANY_DATA');
    return JSON.parse(CompanyData).BASE_CURRENCY;
  }

  getBaseDecimal(){
    var CompanyData: any =  localStorage.getItem('COMPANY_DATA');
    return JSON.parse(CompanyData).NUMBEROFDECIMAL;
  }

  getUserData(){
    var userdata: any =  localStorage.getItem('USER_DATA');
    return JSON.parse(userdata);
  }

  returnDate(d:any){
    return moment(d,"DD/MM/YYYY").toDate();
  }
}
