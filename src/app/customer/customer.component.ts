import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../services/customer-api.service';
import { RootService } from '../services/root.service';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService, ConfirmationService} from 'primeng/api';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CustomerComponent implements OnInit {

  customers: any[] = [];
  public customer_Type: any[] = [];
  public tableSchema :any =[];
  public PaymentPopup :boolean = false;
  public angForm: FormGroup;
  public formData: any;
  public selected:any;
  public blocked: boolean = false;
  addCustomerHideShow:boolean = false;
  customerID:any ='';

  constructor(private customerapi: CustomerApiService, 
    public root: RootService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private primengConfig: PrimeNGConfig) { 
      this.createform();
    }

  ngOnInit(): void {
    this.getAllCustomer();
    this.primengConfig.ripple = true;
    this.intTable();

    
  }

  createform(){
    this.angForm = this.fb.group({
      customerID: ['', Validators.required],
      name: ['', Validators.required],
      customer_type_id: ['', Validators.required],
      telno: [''],
      email: [''],
      remarks: [''],
      addoredit: [null],
    });
  }

  getAllCustomer(){
    this.customerapi.get_customerAll().then(customer=>{
      this.customers = customer['result'].customer_all;
      this.customer_Type = customer['result'].customer_Type;
      this.runForm();
    })
  }

  intTable(){
    this.tableSchema['mainschema'] = [
      {field: 'CNAME', header: 'Customer Name', type: 'text', width: 'auto'},
      {field: 'CUSTOMER_TYPE_ID', header: 'Customer Type', type: 'text', width: 'auto'},
      {field: 'TELNO', header: 'Customer Phone', type: 'text', width: 'auto'},
      {field: 'EMAIL', header: 'Customer Email', type: 'text', width: 'auto'},
    ];

    this.tableSchema['buttonSchema'] = [
      {icon: 'pi-pencil', tooltip: 'Edit Draft Sales', action: 'edit'},
    ];

    this.runForm();
  }
  runForm(){
    this.formData = [
      { 'col': 6, 'name': 'customerID', 'type': 'text', 'lable': 'Customer ID *', },
      { 'col': 6, 'name': 'name', 'type': 'text', 'lable': 'Customer Name *', },
      { 'col': 6, 'name': 'customer_type_id', 'type': 'dropdown', 'lable': 'Customer Type *', 'options':this.customer_Type, 'optionLabel':'CUSTOMER_TYPE_DESC', 'optionValue':'CUSTOMER_TYPE_ID' },
      { 'col': 6, 'name': 'telno', 'type': 'mobile', 'pattern': '99 9999 999 999', 'lable': 'Customer Phone', },
      { 'col': 6, 'name': 'email', 'type': 'text', 'lable': 'Customer Email', },
      { 'col': 12, 'name': 'remarks', 'type': 'textarea', 'lable': 'Remarks', }
    ];
  }
  onclickEvent(e:any){
    switch(e.action) {
      case 'edit':
        this.openedit(e.data);
        break;
    }
  }

  openedit(e:any){
    this.angForm.reset();
    this.angForm.controls['customerID'].setValue(e['USER_ID']);
    this.angForm.controls['name'].setValue(e['CNAME']);
    this.angForm.controls['customer_type_id'].setValue(e['CUSTOMER_TYPE_ID']);
    this.angForm.controls['telno'].setValue(e['TELNO']);
    this.angForm.controls['email'].setValue(e['EMAIL']);
    this.angForm.controls['remarks'].setValue(e['REMARKS']);
    this.angForm.controls['addoredit'].setValue(99);
    this.addCustomerHideShow = true;
  }

  addCustomer(){
    if(this.angForm.value['addoredit'] == null){
      this.customerapi.getCustomerInsertID().then(customer => {
        var data = {
          'customerID': this.angForm.value['customerID'],
          'name': this.angForm.value['name'],
          'customer_type_id': this.angForm.value['customer_type_id'],
          'telno': this.angForm.value['telno'],
          'email': this.angForm.value['email'],
          'remarks': this.angForm.value['remarks'],
          'country': this.root.getCompanyData()['COUNTY'],
          'plant': this.root.getCompanyData()['PLANT'],
          'companyregnumber': this.root.getCompanyData()['companyregnumber'],
          'CRAT': this.root.getCompanyData()['CRAT'],
          'CRBY': this.root.getUserData()['USER_ID'],
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
    else{
        var data = {
          'customerID': this.angForm.value['customerID'],
          'name': this.angForm.value['name'],
          'customer_type_id': this.angForm.value['customer_type_id'],
          'telno': this.angForm.value['telno'],
          'email': this.angForm.value['email'],
          'remarks': this.angForm.value['remarks'],
          'country': this.root.getCompanyData()['COUNTY'],
          'plant': this.root.getCompanyData()['PLANT'],
          'companyregnumber': this.root.getCompanyData()['companyregnumber'],
          'CRAT': this.root.getCompanyData()['CRAT'],
          'CRBY': this.root.getUserData()['USER_ID'],
        }
    
        this.customerapi.update_Customer(data).then((data:any)=>{
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
    }
  }

  openAddCustomer(){
    this.angForm.reset();
    this.customerapi.getCustomerInsertID().then(customer => {
      this.customerID = customer['result'].custoid
      this.angForm.controls['customerID'].setValue(this.customerID);
      this.angForm.controls['addoredit'].setValue(null);
      this.addCustomerHideShow = true;
    });
    
  }
}

