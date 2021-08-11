import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { CustomerApiService } from '../services/customer-api.service';
import { PosApiService } from '../services/pos-api.service';
import { RootService } from '../services/root.service';
import { PosService} from '../services/pos.service';
import { PrimeNGConfig } from 'primeng/api';
import { PosTabelComponent } from '../component/pos-tabel/pos-tabel.component';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {FormControl} from '@angular/forms';
import { MessageService} from 'primeng/api';
import { Router, ActivatedRoute } from "@angular/router";

export class Customer {
  constructor(public custName: string, public NAME: string, public customerTypeDesc: string) { }
}

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
  providers: [MessageService]
})
export class PosComponent implements OnInit {

  public customers: Customer[] = [];
  public customer_Type: any[] = [];
  stateCtrl: FormControl;
  virtualProducts: any[] = []
  prdType: any[] = []
  prdClass: any[] = []
  prdBrand: any[] = []
  filteredCust: any = [];
  addCustomerHideShow:boolean = false;
  public selectedCustomerAdvanced: any[] = [];
  public formData: any;
  public UOM: any[] = [];
  public angForm: FormGroup;
  public invId:any;
  public inv:any = [];
  
  
  @ViewChild(PosTabelComponent) child: PosTabelComponent;

  constructor(
    private productapi: ProductApiService, 
    public root: RootService, 
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public PosService: PosService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public posapi: PosApiService,
    public customerapi: CustomerApiService,) {
      
    
    this.stateCtrl = new FormControl();
    this.filteredCust = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(customer => customer ? this.filterStates(customer) : this.customers.slice())
      );

      this.angForm = this.fb.group({
        custName: ['', Validators.required],
        customerTypeId: ['', Validators.required],
        telNo: [''],
        email: [''],
        remarks: [''],
      });

   }

  filterStates(name: string) {
    return this.customers.filter(customers =>
      customers.custName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  ngOnInit(): void {

    this.hideAllbars();
    this.getAllProduct();
    this.getAllCustomer();
    this.primengConfig.ripple = true;
    this.stateCtrl.setValue('Walk_In_Customer');

    $('.logo').click();
  }

  

  runForm(){
    this.formData = [
      { 'col': 6, 'name': 'custName', 'type': 'text', 'lable': 'Customer Name', },
      { 'col': 6, 'name': 'customerTypeId', 'type': 'dropdown', 'lable': 'Customer Type', 'options':this.customer_Type, 'optionLabel':'customerTypeDesc', 'optionValue':'customerTypeId' },
      { 'col': 6, 'name': 'telNo', 'type': 'mobile', 'pattern': '(999) 999-9999', 'lable': 'Customer Phone', },
      { 'col': 6, 'name': 'email', 'type': 'text', 'lable': 'Customer Email', },
      { 'col': 12, 'name': 'remarks', 'type': 'textarea', 'lable': 'Remarks', }
    ];
  }

  public ngOnDestroy() {
    document.body.classList.remove('hide-footer');
  }

  hideAllbars(){
    document.body.classList.add('menu-sub-hidden');
    document.body.classList.add('main-hidden');
    document.body.classList.add('sub-hidden');
    document.body.classList.add('hide-footer');
  }

  getAllProduct(){
    this.productapi.get_productsAll().then(products => {

      this.PosService.AllProduct = this.virtualProducts = products['result'].itemMst;

      this.UOM = products['result'].uomMaster;
      this.prdType = products['result'].prdTypeMaster;
      this.prdClass = products['result'].prdClassMaster;
      this.prdBrand = products['result'].prdBrandMaster;

      this.route.params.subscribe(params => {
        if(params['invoiceId'] !== "0"){
          this.invId = params['invoiceId']; 
  
          this.posapi.get_PrintInvoiceData(this.invId).then(data=>{
            this.inv['hdr'] = data['invoiceData'];
            this.inv['dtl'] = data['invoiceDataDtl'];
            this.stateCtrl.setValue(this.inv['hdr']?.custNo);
            setTimeout(()=>{
              this.child.editAction(this.inv);
            }, 1000)
            
          });
        }
      });
      
    });
  }

  getAllCustomer(){
    this.customerapi.get_customerAll().then(customer => {
      this.customers = customer['customerResult'].customer_all;
      this.customer_Type = customer['customerResult'].customer_type;
      this.runForm();
    });
  }

  getselectedProducts(){
    return this.PosService.getselectedProducts();
  }

  openAddCustomer(){
    this.addCustomerHideShow = true;
  }

  addCustomer(){
    this.customerapi.getCustomerInsertID().then(customer => {
      var data = {
        'custNo': customer['result'].custId,
        'name': this.angForm.value['name'],
        'customerTypeId': this.angForm.value['customerTypeId'],
        'telNo': this.angForm.value['telNo'],
        'email': this.angForm.value['email'],
        'remarks': this.angForm.value['remarks'],
        'country': this.root.getCompanyData()['country'],
        'plant': this.root.getCompanyData()['plant'],
        'companyregnumber': this.root.getCompanyData()['companyregnumber'],
        'crAt': this.root.getCompanyData()['crAt'],
        'crBy': this.root.getUserData()['userId'],
      }
  
      this.customerapi.create_Customer(data).then((data:any)=>{
        if(data['status']){
          this.addCustomerHideShow = false;
          this.angForm.reset();
          this.getAllCustomer();
          this.messageService.add({severity:'success', summary:'Customer Added Successfully', detail:''});
        }
        else{
          this.messageService.add({severity:'error', summary:'Error in adding customer', detail:''});
        }
      });
    });
  }

}
