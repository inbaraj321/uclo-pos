import { Component, OnInit } from '@angular/core';
import { PosApiService } from '../services/pos-api.service';
import { RootService } from '../services/root.service';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService, ConfirmationService} from 'primeng/api';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-returnitem',
  templateUrl: './returnitem.component.html',
  styleUrls: ['./returnitem.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ReturnitemComponent implements OnInit {
  returnns: any[] = [];
  public customer_Type: any[] = [];
  public tableSchema :any =[];
  public PaymentPopup :boolean = false;
  public angForm: FormGroup;
  public formData: any;
  public selected:any= [];
  public selectedProducts3:any= [];
  public blocked: boolean = false;
  public note: any = '';
  addCustomerHideShow:boolean = false;

  public searchInvValue: any ='';
  public searchGinoValue: any ='';

  Invids:any;
  Gino:any;

  constructor(private PosApiService: PosApiService, 
    public root: RootService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private primengConfig: PrimeNGConfig) { 
      this.createform();
    }

  ngOnInit(): void {
    this.get_InvoiceIdGino();
    this.primengConfig.ripple = true;
    this.intTable();
  }

  createform(){
    this.angForm = this.fb.group({
      customerID: [''],
      name: ['', Validators.required],
      customer_type_id: ['', Validators.required],
      telno: [''],
      email: [''],
      remarks: [''],
    });
  }

  get_InvoiceIdGino(){
    debugger;
    this.PosApiService.get_InvoiceIdGino().then(data=>{
      this.Invids = data.invoice;
      this.Gino = data.gino;
    });

    this.PosApiService.get_SalesReturnList().then(data=>{
      this.returnns = data['allreturn'];
    });
  }

  search(){
    debugger;
    if(this.searchInvValue !== '' || this.searchGinoValue !== ''){

      var data = {
        inv: this.searchInvValue,
        gino: this.searchGinoValue
      }
      this.PosApiService.get_searchbyInvoiceIdGino(data).then(data3=>{
        this.selected = data3['data'];
      })
    }
    else{
      this.messageService.add({severity:'error', summary:'Please Add Invoice / GINO ', detail:''});
    }
  }

  intTable(){
    this.tableSchema['mainschema'] = [
      {field: 'soReturn', header: 'SO RETURN NO', type: 'text', width: 'auto'},
      {field: 'giNO', header: 'GINO', type: 'text', width: 'auto'},
      {field: 'invoice', header: 'INVOICE', type: 'text', width: 'auto'},
      {field: 'custNo', header: 'CUSTOMER NAME', type: 'text', width: 'auto'},
      {field: 'returnDate', header: 'RETURN DATE', type: 'text', width: 'auto'},
      {field: 'returnQty', header: 'RETURN QTY', type: 'text', width: 'auto'},
      {field: 'status', header: 'STATUS', type: 'text', width: 'auto'},
    ];

    this.tableSchema['buttonSchema'] = [
    ];

  }
  
  onclickEvent(e:any){
    switch(e.action) {
      case 'edit':
        break;
    }
  }



  addReturn(){
    if(this.selectedProducts3.length > 0){
      var data = {
        'Invoice': this.searchInvValue,
        'gino': this.searchGinoValue,
        'product': this.selectedProducts3,
        'note': this.note,
        'CRBY': this.root.getUserData()['USER_ID'],
      }

      this.PosApiService.addReturn(data).then((data:any)=>{
        debugger;
        if(data['status']){
          this.addCustomerHideShow = true;
          this.angForm.reset();
          this.get_InvoiceIdGino();
          this.messageService.add({severity:'success', summary:'Return Added Successfully', detail:''});
        }
        else{
          this.messageService.add({severity:'error', summary:'Error in adding Return', detail:''});
        }
      });
    }
    else{
      this.messageService.add({severity:'error', summary:'add some product', detail:''});
    }
    
  }

  openNewReturn(){
    debugger;
    this.addCustomerHideShow = true;
  }
}

