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
  public customer_type: any[] = [];
  public tableSchema :any =[];
  public PaymentPopup :boolean = false;
  public angForm: FormGroup;
  public formData: any;
  public selected:any;
  public blocked: boolean = false;
  addCustomerHideShow:boolean = false;
  custNo:any ='';

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
      custNo: ['', Validators.required],
      custName: ['', Validators.required],
      customerTypeId: ['', Validators.required],
      telNo: [''],
      email: [''],
      remarks: [''],
      addoredit: [null],
    });
  }

  getAllCustomer(){
    debugger;
    this.customerapi.get_customerAll().then(customer=>{
      console.log(customer);
      this.customers = customer['customerResult'].customer_all;
      this.customer_type = customer['customerResult'].customer_type;
      this.runForm();
    })
  }

  intTable(){
    this.tableSchema['mainschema'] = [
      {field: 'custName', header: 'Customer Name', type: 'text', width: 'auto'},
      {field: 'customerTypeId', header: 'Customer Type', type: 'text', width: 'auto'},
      {field: 'telNo', header: 'Customer Phone', type: 'text', width: 'auto'},
      {field: 'email', header: 'Customer Email', type: 'text', width: 'auto'},
    ];

    this.tableSchema['buttonSchema'] = [
      {icon: 'pi-pencil', tooltip: 'Edit Draft Sales', action: 'edit'},
    ];

    this.runForm();
  }
  runForm(){
    this.formData = [
      { 'col': 6, 'name': 'custNo', 'type': 'text', 'lable': 'Customer ID *', },
      { 'col': 6, 'name': 'custName', 'type': 'text', 'lable': 'Customer Name *', },
      { 'col': 6, 'name': 'customerTypeId', 'type': 'dropdown', 'lable': 'Customer Type *', 'options':this.customer_type, 'optionLabel':'customerTypeDesc', 'optionValue':'customerTypeId' },
      { 'col': 6, 'name': 'telNo', 'type': 'text',  'lable': 'Customer Phone', },
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
    this.angForm.controls['custNo'].setValue(e['custNo']);
    this.angForm.controls['custName'].setValue(e['custName']);
    this.angForm.controls['customerTypeId'].setValue(e['customerTypeId']);
    this.angForm.controls['telNo'].setValue(e['telNo']);
    this.angForm.controls['email'].setValue(e['email']);
    this.angForm.controls['remarks'].setValue(e['remarks']);
    this.angForm.controls['addoredit'].setValue(99);
    this.addCustomerHideShow = true;
  }

  addCustomer(){
    if(this.angForm.value['addoredit'] == null){
      this.customerapi.getCustomerInsertID().then(customer => {
        var data = {
          'custNo': this.angForm.value['custNo'],
          'custName': this.angForm.value['custName'],
          'customerTypeId': this.angForm.value['customerTypeId'],
          'telNo': this.angForm.value['telNo'],
          'email': this.angForm.value['email'],
          'remarks': this.angForm.value['remarks'],
          'country': this.root.getCompanyData()['country'],
          'plant': this.root.getCompanyData()['plant'],
          'companyRegNumber': this.root.getCompanyData()['companyRegNumber'],
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
    else{
        var data = {
          'custNo': this.angForm.value['custNo'],
          'custName': this.angForm.value['custName'],
          'customerTypeId': this.angForm.value['customerTypeId'],
          'telNo': this.angForm.value['telNo'],
          'email': this.angForm.value['email'],
          'remarks': this.angForm.value['remarks'],
          'country': this.root.getCompanyData()['country'],
          'plant': this.root.getCompanyData()['plant'],
          'companyRegNumber': this.root.getCompanyData()['companyRegNumber'],
          'crAt': this.root.getCompanyData()['crAt'],
          'crBy': this.root.getUserData()['userId'],
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
      this.custNo = customer['result'].custId
      this.angForm.controls['custNo'].setValue(this.custNo);
      this.angForm.controls['addoredit'].setValue(null);
      this.addCustomerHideShow = true;
    });
    
  }
}

