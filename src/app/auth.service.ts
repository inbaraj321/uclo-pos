import { Injectable } from '@angular/core';
import { User } from './user';
import {RootService} from './services/root.service';
import { Router } from  '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private root:RootService, private router: Router, private http: HttpClient,) { }

  public signIn(userData: User){
    this.login_http(userData).then((data:any)=>{
      if(data['status'] == true){
        localStorage.setItem('ACCESS_TOKEN', data['result'].token);
        localStorage.setItem('USER_DATA', JSON.stringify(data['result'].user_data));
        localStorage.setItem('COMPANY_DATA', JSON.stringify(data['result'].company_data));
        this.router.navigateByUrl('/home/dashboard');
      }else{
        console.log('test');
      }
    });
  }

  login_http(data:User){
    return this.http.post<any>(this.root.BASE_URL + 'auth/login', data)
      .toPromise()
      .then(data => { return data; });
  }

  public isLoggedIn(){
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }

  public logout(){
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }

  getToken(){
    return localStorage.getItem('ACCESS_TOKEN');
  }

  getUserData(){
    var userdata: any =  localStorage.getItem('USER_DATA');
    return JSON.parse(userdata);
  }
  
}
