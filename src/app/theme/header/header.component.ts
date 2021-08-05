import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../../auth.service';
import {RootService} from '../../services/root.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public userData :any;
  public UserImg: any;

  constructor(public auth: AuthService, public root: RootService) { }

  ngOnInit(): void {
    this.userData = this.auth.getUserData();
    this.UserImg =  this.root.getimageByUserUrl(this.userData?.IMAGEPATH)
  }

  logout(){
    this.auth.logout();
  }

}
