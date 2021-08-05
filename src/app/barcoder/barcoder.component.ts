import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { RootService } from '../services/root.service';
import { PosApiService } from '../services/pos-api.service';
import { AuthService } from  '../auth.service';
import {Location} from '@angular/common';

declare var run2Script: Function;

@Component({
  selector: 'app-barcoder',
  templateUrl: './barcoder.component.html',
  styleUrls: ['./barcoder.component.scss']
})
export class BarcoderComponent implements OnInit {
  public ProID:any;

  public width:any  = '2mm';
  public height :number = 100;
  public textAlign:any = 'center';
  public position:any = 'bottom';
  public size:number = 12;
  public display:boolean = true;
  public showorhide:boolean = true;
  public Mtop:number = 10;
  public Mbottom:number = 10;
  public Mleft:number = 10;
  public Mright:number = 10;

  public type:any = 'CODE128';

  public count:number = 10;
  public countarray:any = [];

  typelist:any = [
    {code: 'CODE128',name: 'CODE128'},
    {code: 'CODE128A',name: 'CODE128A'},
    {code: 'CODE128B',name: 'CODE128B'},
    {code: 'CODE128C',name: 'CODE128C'},
    {code: 'EAN13',name: 'EAN13'},
    {code: 'UPC',name: 'UPC'},
    {code: 'EAN8',name: 'EAN8'},
    {code: 'EAN5',name: 'EAN5'},
    {code: 'EAN2',name: 'EAN2'},
    {code: 'CODE39',name: 'CODE39'},
    {code: 'ITF14',name: 'ITF14'},
    {code: 'MSI',name: 'MSI'},
    {code: 'MSI10',name: 'MSI10'},
    {code: 'MSI11',name: 'MSI11'},
    {code: 'MSI1010',name: 'MSI1110'},
    {code: 'pharmacode',name: 'pharmacode'},
    {code: 'codabar',name: 'codabar'},
  ];

  textalign:any = [
    {code: 'center',name: 'center'},
    {code: 'left',name: 'left'},
    {code: 'right',name: 'right'},
  ];
  textposition:any = [
    {code: 'top',name: 'top'},
    {code: 'bottom',name: 'bottom'},
  ]

  textdisplay:any = [
    {code: false,name: 'Hide'},
    {code: true,name: 'Show'},
  ]

  constructor(
    private route: ActivatedRoute,
    public root: RootService,
    public auth: AuthService,
    private router: Router,
    private _location: Location,
    public posapi: PosApiService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ProID = params['productID']; 
      this.countarray = Array(this.count).fill(0);
    });

    setTimeout(function(){
      run2Script();
    }, 300);
  }

  backToPOS(){
    this._location.back();
  }

  updateAngForm(){
    this.countarray = Array(this.count).fill(0);
  }

}
