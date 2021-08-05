import { Component, OnInit } from '@angular/core';

declare var run2Script: Function;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(function(){
      run2Script();
    }, 300);
  }

}
