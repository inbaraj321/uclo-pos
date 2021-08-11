import { Component, OnInit } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { PosApiService } from '../services/pos-api.service';
import { RootService } from '../services/root.service';
import { PosService} from '../services/pos.service';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService, ConfirmationService} from 'primeng/api';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-sales-draft',
  templateUrl: './sales-draft.component.html',
  styleUrls: ['./sales-draft.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SalesDraftComponent implements OnInit {

  virtualSales: any[] = [];
  public tableSchema :any =[];
  public PaymentPopup :boolean = false;
  public angForm: FormGroup;
  public formData: any;
  public selected:any;
  public blocked: boolean = false;

  constructor(private productapi: ProductApiService, 
    public root: RootService,
    public PosService: PosService,
    public posapi: PosApiService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private primengConfig: PrimeNGConfig) { 
      this.createform();
    }

  ngOnInit(): void {
    this.getAllSales();
    this.primengConfig.ripple = true;
    this.intTable();
  }

  createform(){
    this.angForm = this.fb.group({
      date: [new Date(), Validators.required],
      amount: ['', Validators.required],
      payby: ['cash', Validators.required],
      reference: [''],
      remarks: [''],
    });
  }

  getAllSales(){
    this.posapi.get_allSalesDraft().then(sales=>{
      this.virtualSales = sales['allSales'];
    })
  }

  intTable(){
    this.tableSchema['mainschema'] = [
      {field: 'invoiceDate', header: 'Date', type: 'text', width: 'auto',status: 'D' },
      {field: 'invoice', header: 'Invoice No.', type: 'text', width: 'auto', },
      {field: 'giNo', header: 'GINO', type: 'text', width: 'auto', },
      {field: 'custNo', header: 'Customer Name', type: 'text', width: 'auto', },
      {field: 'billStatus', header: 'Status', type: 'text', width: 'auto', status: 'S' },
      {field: 'totalAmount', header: 'Grand Total', type: 'text', width: 'auto'},
      //  status: 'CUR' neet to set currency type in totalAmount
    ];

    this.tableSchema['buttonSchema'] = [
      {icon: 'pi-pencil', tooltip: 'Edit Draft Sales', action: 'edit'},
      {icon: 'pi-trash', tooltip: 'Delete Draft Sales', action: 'delete'},
    ];

    this.runForm();
  }
  runForm(){

    var paymentType:any = [
      {'code':'cash', 'name':'Cash'},
      {'code':'CC', 'name':'Credit Card'},
      {'code':'DC', 'name':'Debit Card'},
      {'code':'cheque', 'name':'Cheque'},
      {'code':'gift_card', 'name':'Gift Card'},
      {'code':'stripe', 'name':'Stripe'},
      {'code':'nets', 'name':'Nets Payment'},
      {'code':'other', 'name':'Other'}
    ]

    this.formData = [
      { 'col': 6, 'name': 'date', 'type': 'date', 'lable': 'Date'},
      { 'col': 6, 'name': 'amount', 'type': 'number', 'lable': 'Amount'},
      { 'col': 6, 'name': 'payby', 'type': 'dropdown', 'lable': 'Paying by', 'options':paymentType, 'optionLabel':'name', 'optionValue':'code'},
      { 'col': 6, 'name': 'reference', 'type': 'text', 'lable': 'Reference'},
      { 'col': 12, 'name': 'remarks', 'type': 'textarea', 'lable': 'Remarks', }
    ];
  }
  MakePaymentsubmit(billStatus = 'Partially Paid'){

    this.blocked = true;

    if((this.selected['totalAmount'] - (parseFloat(this.angForm.controls['amount'].value) + this.selected['TOTAL_PAID_BY_CUST'])) == 0 ){
      billStatus = 'PAID';
    }

    var data:any = {
      'plant': this.root.getCompanyData()['plant'],
      'custNo': this.selected.custNo,
      'givenAmount': this.angForm.controls['amount'].value,
      'cashTypeOption': this.angForm.controls['payby'].value,
      'referenceNo': this.angForm.controls['reference'].value,
      'note': this.angForm.controls['remarks'].value,
      'crAt': this.root.getCompanyData()['crAt'],
      'crBy': this.root.getUserData()['userId'],
      'BASE_CURRENCY': this.root.getCompanyData()['BASE_CURRENCY'],
      'SUB_TOTAL': this.selected.SUB_TOTAL,
      'totalAmount': this.selected.totalAmount,
      'invID': this.selected.ID,
      'billStatus': billStatus
    }

    this.posapi.update_payment(data).then((data:any)=>{
      if(data['status'] == true){
        this.getAllSales();
        this.blocked = false;
        this.messageService.add({severity:'success', summary:'Payment successfull', detail:'Page will redirect to print'});
        this.PaymentPopup = false;
      }
      else{
        this.messageService.add({severity:'error', summary:'Error', detail:'Error in payment'});
        this.blocked = false;
      }
    });

  }
  onclickEvent(e:any){
    switch(e.action) {
      case 'view':
        this.viewData(e.data);
        break;
      case 'delete':
        this.deleteDraft(e.data);
        break;
      case 'edit':
        this.editData(e.data);
        break;
    }
  }

  deleteDraft(event: Event) {
    var dataa:any = event;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
          var data:any = {
            'invID': dataa['ID'],
          }
          this.posapi.delete_Dpayment(data).then((data:any)=>{
            if(data['status'] == true){
              this.getAllSales();
              this.blocked = false;
              this.messageService.add({severity:'success', summary:'Deleted successfull', detail:''});

            }
            else{
              this.messageService.add({severity:'error', summary:'Error', detail:'Error in payment'});
              this.blocked = false;
            }
          });
        }
    });
  }

  viewData(e:any){
    this.router.navigateByUrl('print-invoice/'+ e?.invoice);
  }
  MakePayment(e:any){
    if(e?.billStatus == 'Partially Paid'){      
      this.angForm.reset();
      this.selected = e;
      this.angForm.controls['date'].setValue(new Date());
      this.angForm.controls['payby'].setValue('payby');
      this.angForm.controls['amount'].setValue(this.root.returnWithdenomination(e['totalAmount'] - e['TOTAL_PAID_BY_CUST']));
      this.PaymentPopup = true;
    }
    else{
      this.messageService.add({severity:'error', summary:'No Pending Payments..!', detail:''});
      return;
    }
  }
  editData(e:any){
    if((e?.billStatus).toLowerCase() == 'draft'){
      this.router.navigateByUrl('home/pos/'+ e?.invoice);
    }
    else{
      this.messageService.add({severity:'error', summary:'Only Draft Can Be Edited..!', detail:''});
      return;
    }
  }

}

