import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { RootService } from '../services/root.service';
import { PosApiService } from '../services/pos-api.service';
import { AuthService } from  '../auth.service';
import {Location} from '@angular/common';

declare var run2Script: Function;

@Component({
  selector: 'app-invoiceprint',
  templateUrl: './invoiceprint.component.html',
  styleUrls: ['./invoiceprint.component.scss']
})
export class InvoiceprintComponent implements OnInit {
  public invId:any = '';
  public CmpImg: any;
  public cmpData: any;

  public invHdr: any = [];
  public invoiceDatadtl: any = [];
  public invoicepaymentDetail: any = [];

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
      this.invId = params['invoiceid']; 

      this.cmpData = this.root.getCompanyData();
      this.CmpImg =  this.root.getimageByUrl('C:/S2TCONFIGLIVE//track/Logos/'+this.cmpData['PLANT']+'Logo.GIF');

      this.posapi.get_PrintInvoiceData(this.invId).then(data=>{
        this.invHdr = data['invoiceData']
        this.invoiceDatadtl = data['invoiceDataDtl']
        this.invoicepaymentDetail = data['invoicePaymentDetail']
      });
    });


    setTimeout(function(){
      run2Script();
    }, 300);
  }

  backToPOS(){
    this._location.back();
  }

}
