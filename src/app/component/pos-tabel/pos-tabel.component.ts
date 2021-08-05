import { Component, OnInit, AfterViewInit, Input, ViewChild  } from '@angular/core';
import { RootService} from '../../services/root.service';
import { PosService} from '../../services/pos.service';
import { PosApiService } from '../../services/pos-api.service';
import {ConfirmationService, MessageService} from 'primeng/api';

import { Router } from  '@angular/router';
import * as $ from "jquery";

@Component({
  selector: 'app-pos-tabel',
  templateUrl: './pos-tabel.component.html',
  styleUrls: ['./pos-tabel.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PosTabelComponent implements OnInit {
  @Input() public SelectedProducts:any;
  @Input() public UOM:any;
  @Input() public customer:any;
 
  selected: any = [];
  singleViewProduct: any = [];
  ViewProductHideShow:boolean = false;
  PrintOrderHideShow:boolean = false;
  PrintBillHideShow:boolean = false;
  paymentHideShow:boolean = false;
  InvOrNonInv:boolean = true;
  discound:number = 0.00;
  discountvalue:any = '0.00';
  givenAmount:any = '0.00';
  referenceNo:any = '';
  note:any = '';
  taxlist:any = [];
  selectedTask:any = [];
  cashTypeOption:any = 'cash';
  public blocked: boolean = false;
  public editvalue = 0;
  public InvHdr:any =[];
  public InvDtl:any =[];

  paymentType:any = [
    {'code':'cash', 'name':'Cash'},
    {'code':'CC', 'name':'Credit Card'},
    {'code':'DC', 'name':'Debit Card'},
    {'code':'cheque', 'name':'Cheque'},
    {'code':'gift_card', 'name':'Gift Card'},
    {'code':'stripe', 'name':'Stripe'},
    {'code':'nets', 'name':'Nets Payment'},
    {'code':'other', 'name':'Other'}
  ]

  constructor(
    public root: RootService,
    public possrv: PosService,
    public posapi: PosApiService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService) { 
      
    }

  ngOnInit(): void {
    this.selected = this.SelectedProducts;
    this.getTasklist();
  }

  editAction(d:any){
    this.editvalue = 1;
    this.InvHdr = d.hdr;
    this.InvDtl = d.dtl;
    var $this = this;
    d.dtl.filter(function(node:any) {
      $this.possrv.AllProduct.filter((e:any)=>{
         if(node.ITEM == e.ITEM){
            e['sellingQty'] = node.QTY;
            $this.discountvalue = d.hdr.DISCOUNT==null?'0.00':d.hdr.DISCOUNT.toString();
            if(d.hdr.TAXAMOUNT > 0){
              //tax
            }
            $this.possrv.selectedProduct.push(e);
         }
      })
    });
  }

  getTasklist(){
    this.posapi.get_taxtypes().then((data)=>{
      this.taxlist = data['TAXLIST'];
      this.selectedTask = this.taxlist.filter((o:any) => {
        return o['SHOWTAX'] == 1 && o['ISZERO'] == 1;
      });
    });
  }

  changeQty(item:any, Qty:any){
    if(Qty.target.value == '' || Qty.target.value == null){
      return;
    }
    if(Qty.target.value == 0){
      this.messageService.add({severity:'error', summary:'Quantity Cannot be less than one', detail:''});
      return;
    }
    if(Qty.target.value == item['availableQty'] ||  parseFloat(item['availableQty']) < parseFloat(Qty.target.value)){
      this.messageService.add({severity:'error', summary:'Maximum Quantity Reached', detail:''});
      return;
    }
    if(item['MAXSTKQTY'] !== "0"){
      if(parseFloat(item['MAXSTKQTY']) < parseFloat(Qty.target.value)){
        this.messageService.add({severity:'error', summary:'Maximum Selling Quantity Reached', detail:''});
        return;
      }
    }
    item['sellingQty'] = Qty.target.value;
  }

  showTotalProduct(){
    var totalvalue = 0;
    this.selected.forEach((element:any) => {
      totalvalue += parseFloat(element['sellingQty']);
    });

    return this.selected.length+' ('+this.root.returnWithdenomination(totalvalue)+')';
  }

  showTotalprice(){
    var totalvalue = 0;
    this.selected.forEach((element:any) => {
      totalvalue += (parseFloat(element['sellingQty']) * parseFloat(element['UnitPrice']));
    });

    return totalvalue;
  }

  removeitem(item:any){
    this.selected = this.possrv.removeProduct(item);
  }

  showgrandTotal(){
    return this.showTotalprice() + this.getTax() - this.getDiscound();
  }

  confirmCancel(event: Event) {
    if(this.selected.length <= 0){
      this.messageService.add({severity:'error', summary:'No Product', detail:'No product to cancel'});
      return;
    }
    this.confirmationService.confirm({
          target: event.target as EventTarget, 
          message: 'Are you sure that you want to proceed?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            window.location.reload();
          },
          reject: () => {
              this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
          }
      });
    }

    uomChange(e:any){
      console.log(e);
    }

    updateProduct(){
      this.ViewProductHideShow = false;
    }

    OpenProduct(product:any){
      this.ViewProductHideShow = true;
      this.singleViewProduct = product;
    }

    getDiscound(){
      var discount = 0;
      var subtotal = this.showTotalprice();
      
      if(this.discountvalue.search("%") > 0){
        var discound = parseInt(this.discountvalue.replace('%',''));
        var totaldiscoundvalue = subtotal * ( (100 - discound) / 100 );
        discound = subtotal - totaldiscoundvalue;
      }
      else{
        discound = this.discountvalue;
      }

      return discound;
    }

    discountClick(){
      setTimeout(()=>{
        $('#discountInput').select();
      }, 500);
      
    }

    getTax(){
      var tax = 0.00;
      var subtotal = this.showTotalprice();
      
      if(this.selectedTask[0]?.ISZERO == 0){
        var taxvalue = this.selectedTask[0]?.percentagevalue
        var totaldiscoundvalue = subtotal * ( (100 - taxvalue) / 100 );
        tax = subtotal - totaldiscoundvalue;
      }
      else{
        tax = 0.00;
      }

      return tax;
    }

    openPrintOrder(){
      if(this.selected.length > 0){
        this.PrintOrderHideShow = true
      }
      else{
        this.messageService.add({severity:'error', summary:'No Product', detail:'No product to print'});
      }
      
    }

    openPrintBill(){
      if(this.selected.length > 0){
        this.PrintBillHideShow = true
      }
      else{
        this.messageService.add({severity:'error', summary:'No Product', detail:'No product to print'});
      }
      
    }

    openPayment(){
      if(this.customer?.value == null || this.customer?.value == ''){
        this.messageService.add({severity:'error', summary:'No User', detail:'No user to print'});
        return
      }
      if(this.selected.length > 0){
        this.paymentHideShow = true
      }
      else{
        this.messageService.add({severity:'error', summary:'No Product', detail:'No product to print'});
      }
    }
  
    addPrice(value:any){
      if(value == 'clear'){
        this.givenAmount = 0;
        return
      }
      this.givenAmount = this.root.returnWithdenomination(parseFloat(this.givenAmount>0?this.givenAmount:0) + parseFloat(value));
    }

    getRoundOffValue(){
      var value = Math.round(this.showgrandTotal());
      return (this.showgrandTotal() - value);
    }

    getGrandtotalwithRound(){
      return Math.round(this.showgrandTotal());
    }
    
    Hold(BILL_STATUS:any){
      if(this.customer?.value == null || this.customer?.value == ''){
        this.messageService.add({severity:'error', summary:'No User', detail:'No user to print'});
        return;
      }
      if(this.selected.length <= 0){
        this.messageService.add({severity:'error', summary:'No Product', detail:'No product to hold'});
        return;
      }
      BILL_STATUS = 'draft';
      this.posapi.get_paymentInsertID().then(payment => {
        var data:any = {
          'discound': this.getDiscound(),
          'SALES_LOCATION': this.root.getCompanyData()['COUNTRY_CODE'],
          'INVOICE': payment.INVOICEID,
          'CUSTNO': this.customer?.value,
          'DISCOUNT_TYPE': this.root.getCompanyData()['BASE_CURRENCY'],
          'GINO': payment.GIID,
          'plant': this.root.getCompanyData()['PLANT'],
          'CRAT': this.root.getCompanyData()['CRAT'],
          'CRBY': this.root.getUserData()['USER_ID'],
          'UPAT': this.root.getCompanyData()['UPAT'] !== null?this.root.getCompanyData()['UPAT']: '',
          'ADJUSTMENT': this.getRoundOffValue(),
          'BASE_CURRENCY': this.root.getCompanyData()['BASE_CURRENCY'],
          'note': this.note,
          'TOTAL_AMOUNT': this.getGrandtotalwithRound(),
          'SUB_TOTAL': this.showTotalprice(),
          'items': this.selected,
          'BILL_STATUS': BILL_STATUS,
          'givenAmount': this.givenAmount - (this.givenAmount - this.getGrandtotalwithRound()),
          'TAXAMOUNT': this.getTax(),
          'InvOrNonInv': this.InvOrNonInv,
          'TOTAL_PAYING': this.givenAmount,
          'cashTypeOption': this.cashTypeOption,
          'SHIPPINGID': payment.SHIPPINGID,
          'referenceNo': this.referenceNo,
        }

        this.posapi.create_payment(data).then((data:any)=>{
          if(data['status'] == true){
            this.messageService.add({severity:'success', summary:'Order Draft successfull', detail:''});
            window.location.reload();
          }
          else{
            this.messageService.add({severity:'error', summary:'Error', detail:'Error in payment'});
          }
        });
      })
    }

    Pay(BILL_STATUS = 'Open'){

      if((this.getGrandtotalwithRound() - this.givenAmount) <= 0 &&  BILL_STATUS !== 'draft'){
        BILL_STATUS = 'PAID';
      }
      else if(this.givenAmount !== 0 &&  BILL_STATUS !== 'draft'){
        BILL_STATUS = 'Partially Paid';
      }

      if( (this.getGrandtotalwithRound() - this.givenAmount) > 0 && this.customer?.value == 'Walk_In_Customer'){
        this.messageService.add({severity:'error', summary:'Error', detail:'Please select customer for due payment'});
        this.paymentHideShow = false;
        return;
      }
      var amount = this.givenAmount - (this.givenAmount - this.getGrandtotalwithRound());
      if(this.getGrandtotalwithRound() > this.givenAmount){
        amount = this.givenAmount;
      }

      if(this.editvalue == 0) {
        this.posapi.get_paymentInsertID().then(payment => {
          this.blocked = true;
          var data:any = {
            'discound': this.getDiscound(),
            'SALES_LOCATION': this.root.getCompanyData()['COUNTRY_CODE'],
            'INVOICE': payment.INVOICEID,
            'CUSTNO': this.customer?.value,
            'DISCOUNT_TYPE': this.root.getCompanyData()['BASE_CURRENCY'],
            'GINO': payment.GIID,
            'plant': this.root.getCompanyData()['PLANT'],
            'CRAT': this.root.getCompanyData()['CRAT'],
            'CRBY': this.root.getUserData()['USER_ID'],
            'UPAT': this.root.getCompanyData()['UPAT'] !== null?this.root.getCompanyData()['UPAT']: '',
            'ADJUSTMENT': this.getRoundOffValue(),
            'BASE_CURRENCY': this.root.getCompanyData()['BASE_CURRENCY'],
            'note': this.note,
            'TOTAL_AMOUNT': this.getGrandtotalwithRound(),
            'SUB_TOTAL': this.showTotalprice(),
            'items': this.selected,
            'BILL_STATUS': BILL_STATUS,
            'givenAmount': amount,
            'TAXAMOUNT': this.getTax(),
            'InvOrNonInv': this.InvOrNonInv,
            'SHIPPINGID': payment.SHIPPINGID,
            'cashTypeOption': this.cashTypeOption,
            'referenceNo': this.referenceNo,
            'TOTAL_PAYING': this.givenAmount
          }
  
          this.posapi.create_payment(data).then((data:any)=>{
            if(data['status'] == true){
              this.blocked = false;
              this.possrv.destroyProduct();
              this.messageService.add({severity:'success', summary:'Payment successfull', detail:'Page will redirect to print'});
              this.router.navigateByUrl('print-invoice/'+ payment.INVOICEID);
            }
            else{
              this.messageService.add({severity:'error', summary:'Error', detail:'Error in payment'});
              this.blocked = false;
            }
          });
        })
      }
      else{
          this.blocked = true;
          var data:any = {
            'discound': this.getDiscound(),
            'SALES_LOCATION': this.root.getCompanyData()['COUNTRY_CODE'],
            'INVOICE': this.InvHdr.INVOICE,
            'invID': this.InvHdr.ID,
            'CUSTNO': this.customer?.value,
            'DISCOUNT_TYPE': this.root.getCompanyData()['BASE_CURRENCY'],
            'GINO': this.InvHdr.GINO,
            'plant': this.root.getCompanyData()['PLANT'],
            'CRAT': this.root.getCompanyData()['CRAT'],
            'CRBY': this.root.getUserData()['USER_ID'],
            'UPAT': this.root.getCompanyData()['UPAT'] !== null?this.root.getCompanyData()['UPAT']: '',
            'ADJUSTMENT': this.getRoundOffValue(),
            'BASE_CURRENCY': this.root.getCompanyData()['BASE_CURRENCY'],
            'note': this.note,
            'TOTAL_AMOUNT': this.getGrandtotalwithRound(),
            'SUB_TOTAL': this.showTotalprice(),
            'items': this.selected,
            'BILL_STATUS': BILL_STATUS,
            'givenAmount': amount,
            'TAXAMOUNT': this.getTax(),
            'InvOrNonInv': this.InvOrNonInv,
            'SHIPPINGID': this.InvHdr.SHIPPINGID,
            'cashTypeOption': this.cashTypeOption,
            'referenceNo': this.referenceNo,
            'TOTAL_PAYING': this.givenAmount
          }
  
          this.posapi.update_Dpayment(data).then((data:any)=>{
            if(data['status'] == true){
              this.blocked = false;
              this.possrv.destroyProduct();
              this.messageService.add({severity:'success', summary:'Payment successfull', detail:'Page will redirect to print'});
              this.router.navigateByUrl('print-invoice/'+ this.InvHdr.INVOICE);
            }
            else{
              this.messageService.add({severity:'error', summary:'Error', detail:'Error in payment'});
              this.blocked = false;
            }
          });
      }

     
    }

    taxChange(e:any){
      $('body').click();
      this.selectedTask = this.taxlist.filter((o:any) => {
        return o['ID'] == this.selectedTask;
      });
    }
  
}
