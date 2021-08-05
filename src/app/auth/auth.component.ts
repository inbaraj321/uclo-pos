import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth.service';
import { Router } from  '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var run2Script: Function;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  //--
  public angForm: FormGroup;
  //--

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {
    this.angForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    setTimeout(function(){
      run2Script();
    }, 300);

    if(this.auth.isLoggedIn() !== null){
      this.router.navigateByUrl('/home/dashboard');
    }
  }

  login(){
    this.auth.signIn(this.angForm.value); 
  }

}
