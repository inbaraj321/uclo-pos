import { Component, OnInit } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';
import { RootService } from '../services/root.service';
import { PosService} from '../services/pos.service';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService} from 'primeng/api';
import { Router } from  '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [MessageService]
})
export class ProductListComponent implements OnInit {

  virtualProducts: any[] = []
  prdType: any[] = []
  prdClass: any[] = []
  prdBrand: any[] = []
  filteredCust: any = [];
  public UOM: any[] = [];
  public tableSchema :any =[];
  addCustomerHideShow:boolean = false;
  public angForm: FormGroup;
  public formData: any;

  constructor(private productapi: ProductApiService, 
    public root: RootService, 
    public PosService: PosService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig) {
      this.createform();
    }

  ngOnInit(): void {
    this.getAllProduct();
    this.primengConfig.ripple = true;
    this.intTable();
  }

  getAllProduct(){
    
    this.productapi.get_productsAll().then(products => {
      this.virtualProducts = products['result'].itemMst;
      this.UOM = products['result'].uomMaster;
      this.prdType = products['result'].prdTypeMaster;
      this.prdClass = products['result'].prdClassMaster;
      this.prdBrand = products['result'].prdBrandMaster;
      this.runForm();
    });
  }

  intTable(){
    this.tableSchema['mainschema'] = [
      {field: 'item', header: 'Product Name', type: 'text', width: 'auto', },
      {field: 'itemDescription', header: 'Product Description', type: 'text', width: 'auto', },
      {field: 'catalogPath', header: 'Catlog', type: 'image', width: 'auto', },
      {field: 'productClassId', header: 'Product Class', type: 'text', width: 'auto', },
      {field: 'itemType', header: 'Product Type', type: 'text', width: 'auto', },
      {field: 'productBrandId', header: 'Product Brand', type: 'text', width: 'auto', },
      {field: 'unitPrice', header: 'List Price', type: 'text', width: 'auto', },
    ];

    this.tableSchema['buttonSchema'] = [
      {icon: 'pi-pencil', tooltip: 'Edit Product', action: 'edit'},
      {icon: 'pi-print', tooltip: 'Print Barcode', action: 'print'},
    ];
  }

  onclickEvent(e:any){
    switch(e.action) {
      case 'print':
        this.printBarcode(e.data);
        break;
        case 'edit':
          this.openedit(e.data);
          break;
    }
  }

  openedit(e:any){
    this.angForm.reset();
    this.angForm.controls['ITEM'].setValue(e['item']);
    this.angForm.controls['NONSTKFLAG'].setValue(e['NONSTKFLAG']);
    this.angForm.controls['ITEMDESC'].setValue(e['itemDescription']);
    this.angForm.controls['STKUOM'].setValue(e['stackUom']);
    this.angForm.controls['NETWEIGHT'].setValue(e['netWeight']);
    this.angForm.controls['GROSSWEIGHT'].setValue(e['grossWeight']);
    this.angForm.controls['PRD_CLS_ID'].setValue(e['productClassId']);
    this.angForm.controls['ITEMTYPE'].setValue(e['itemType']);
    this.angForm.controls['PRD_BRAND_ID'].setValue(e['productBrandId']);
    this.angForm.controls['PURCHASEUOM'].setValue(e['purchaseUom']);
    this.angForm.controls['PURCHASECOST'].setValue(e['purchaseCost']);
    this.angForm.controls['SALESUOM'].setValue(e['salesUom']);
    this.angForm.controls['MINSPRICE'].setValue(e['minsPrice']);
    this.angForm.controls['UnitPrice'].setValue(e['unitPrice']);
    this.angForm.controls['INVENTORYUOM'].setValue(e['inventoryUom']);
    this.angForm.controls['STKQTY'].setValue(e['stackQuantity']);
    this.angForm.controls['MAXSTKQTY'].setValue(e['maximumStackQuantity']);
    this.angForm.controls['CATLOGPATH'].setValue(e['catalogPath']);
    this.angForm.controls['addoredit'].setValue('edit');
    this.addCustomerHideShow = true;
  }

  printBarcode(e:any){
    this.router.navigateByUrl('barcode/'+ e?.ITEM);
  }

  createform(){
    this.angForm = this.fb.group({
      ITEM: ['', Validators.required],
      NONSTKFLAG: ['Y', Validators.required],
      ITEMDESC: ['', Validators.required],
      STKUOM: ['', Validators.required],
      NETWEIGHT: [''],
      GROSSWEIGHT: [''],
      PRD_CLS_ID: ['', Validators.required],
      ITEMTYPE: ['', Validators.required],
      PRD_BRAND_ID: ['', Validators.required],
      PURCHASEUOM: ['', Validators.required],
      PURCHASECOST: ['', Validators.required],
      SALESUOM: ['', Validators.required],
      MINSPRICE: [''],
      UnitPrice: [''],
      INVENTORYUOM: ['', Validators.required],
      STKQTY: ['', Validators.required],
      MAXSTKQTY: [''],
      CATLOGPATH: [''],
      addoredit: [''],
      
    });
  }

  runForm(){

    var stock = [
      {'name': 'Stock', 'code':'Y'},
      {'name': 'Non-Stock', 'code':'N'}
    ]
    this.formData = [
      { 'col': 6, 'name': 'ITEM', 'type': 'text', 'lable': 'Product Id *' },
      { 'col': 6, 'name': 'ITEMDESC', 'type': 'text', 'lable': 'Description *' },
      { 'col': 6, 'name': 'NONSTKFLAG', 'type': 'dropdown', 'lable': 'Stock Type *', 'options':stock, 'optionLabel':'name', 'optionValue':'code' },
      { 'col': 6, 'name': 'STKUOM', 'type': 'uom', 'lable': 'Base UOM *', 'options':this.UOM, 'optionLabel':'qpUom', 'optionValue':'uom' },
      { 'col': 6, 'name': 'NETWEIGHT', 'type': 'number', 'lable': 'Net Weight (KG)' },
      { 'col': 6, 'name': 'GROSSWEIGHT', 'type': 'number', 'lable': 'Gross Weight (KG)' },
      { 'col': 6, 'name': 'PRD_CLS_ID', 'type': 'dropdown', 'lable': 'Product Class *', 'options':this.prdClass, 'optionLabel':'prdClsDesc', 'optionValue':'prdClsId' },
      { 'col': 6, 'name': 'ITEMTYPE', 'type': 'dropdown', 'lable': 'Product Type *', 'options':this.prdType, 'optionLabel':'prdTypeDesc', 'optionValue':'PrdTypeId'  },
      { 'col': 6, 'name': 'PRD_BRAND_ID', 'type': 'dropdown', 'lable': 'Product Brand *', 'options':this.prdBrand, 'optionLabel':'prdBrandDesc', 'optionValue':'prdBrandId'},
      
      { 'col': 12, 'type': 'heading', 'lable': 'Purchase' },
      { 'col': 6, 'name': 'PURCHASEUOM', 'type': 'dropdown', 'lable': 'Purchase UOM *', 'options':this.UOM, 'optionLabel':'qpUom', 'optionValue':'uom' },
      { 'col': 6, 'name': 'PURCHASECOST', 'type': 'number', 'lable': 'Purchase Cost *' },

      { 'col': 12, 'type': 'heading', 'lable': 'Sales' },
      { 'col': 6, 'name': 'SALESUOM', 'type': 'dropdown', 'lable': 'Sales UOM *', 'options':this.UOM, 'optionLabel':'qpUom', 'optionValue':'uom' },
      { 'col': 6, 'name': 'MINSPRICE', 'type': 'number', 'lable': 'Minimum Selling Price' },
      { 'col': 6, 'name': 'UnitPrice', 'type': 'number', 'lable': 'List Price' },

      { 'col': 12, 'type': 'heading', 'lable': 'Inventory' },
      { 'col': 6, 'name': 'INVENTORYUOM', 'type': 'dropdown', 'lable': 'Inventory UOM *', 'options':this.UOM, 'optionLabel':'qpUom', 'optionValue':'uom' },
      { 'col': 6, 'name': 'STKQTY', 'type': 'number', 'lable': 'Min Stock Quantity' },
      { 'col': 6, 'name': 'MAXSTKQTY', 'type': 'number', 'lable': 'Max Stock Quantity' },
      { 'col': 12, 'name': 'CATLOGPATH', 'type': 'image', 'lable': 'Catlog Image' },
    ];

  }


  openAddProduct(){
    this.angForm.reset();
    
    this.productapi.getProductInsertID().then(Product => {
      this.angForm.controls['ITEM'].setValue(Product['result'].prodid);
      this.angForm.controls['addoredit'].setValue(null);
      this.angForm.controls['NONSTKFLAG'].setValue("Y");
      this.addCustomerHideShow = true;
    });
  }

  addProduct(){

      if(this.angForm.value['UnitPrice'] < this.angForm.value['MINSPRICE']){
        this.messageService.add({severity:'error', summary:'List Price cannot be lower than minimum price', detail:''});
        return;
      }
      if(this.angForm.value['UnitPrice'] < this.angForm.value['PURCHASECOST']){
        this.messageService.add({severity:'error', summary:'List Price cannot be lower than cost price', detail:''});
        return;
      }


    if(this.angForm.value['addoredit'] == null){
      this.productapi.getProductInsertID().then(Product => {
        var data = {
          'ITEM': this.angForm.value['ITEM'],
          'MAXSTKQTY': this.angForm.value['MAXSTKQTY'],
          'RENTALPRICE' : 0,
          'VINNO': '',
          'NONSTKTYPEID': 0,
          'ITEM_LOC' : '',
          'MODEL' : '',
          'STKUOM' : this.angForm.value['STKUOM'],
          'NETWEIGHT' : this.angForm.value['NETWEIGHT'],
          'DISCOUNT' : 0,
          'USERFLD1' : 'N',
          'MINSPRICE' : this.angForm.value['MINSPRICE'],
          'ISACTIVE' : 'Y',
          'COST': this.angForm.value['PURCHASECOST'],
          'INVENTORYUOM' : this.angForm.value['INVENTORYUOM'],
          'PRD_CLS_ID': this.angForm.value['PRD_CLS_ID'],
          'PLANT' : this.root.getCompanyData()['PLANT'],
          'PRD_BRAND_ID' : this.angForm.value['PRD_BRAND_ID'],
          'SERVICEUOM' : this.angForm.value['INVENTORYUOM'],
          'CRBY' : this.root.getUserData()['USER_ID'],
          'UNITPRICE' : this.angForm.value['UnitPrice'],
          'PRODGST' : '',
          'COO': '',
          'SALESUOM': this.angForm.value['SALESUOM'],
          'PURCHASEUOM' : this.angForm.value['PURCHASEUOM'],
          'SERVICEPRICE' : 0,
          'GROSSWEIGHT' : 0,
          'ISBASICUOM' : 1,
          'ITEMTYPE' : this.angForm.value['ITEMTYPE'],
          'CATLOGPATH' : '',
          'HSCODE' : '',
          'RENTALUOM' : this.angForm.value['SALESUOM'],
          'REMARK4' : 0,
          'REMARK3' : 0,
          'STKQTY' : this.angForm.value['STKQTY'],
          'CRAT' : this.root.getCompanyData()['CRAT'],
          'REMARK1': '',
          'NONSTKFLAG' : this.angForm.value['NONSTKFLAG'],
          'ITEMDESC' : this.angForm.value['ITEMDESC'],
        }

        this.productapi.create_Product(data).then((data:any)=>{
          if(data['status']){
            this.addCustomerHideShow = false;
            this.angForm.reset();
            this.getAllProduct();
            this.messageService.add({severity:'success', summary:'Product Added Successfully', detail:''});
          }
          else{
            this.messageService.add({severity:'error', summary:'Error in adding Product', detail:''});
          }
        });
        
      });
    }
    else{

      if(this.angForm.value['UnitPrice'] < this.angForm.value['MINSPRICE']){
        this.messageService.add({severity:'error', summary:'List Price cannot be lower than minimum price', detail:''});
        return;
      }
      if(this.angForm.value['UnitPrice'] < this.angForm.value['PURCHASECOST']){
        this.messageService.add({severity:'error', summary:'List Price cannot be lower than cost price', detail:''});
        return;
      }
      
      var data = {
        'ITEM': this.angForm.value['ITEM'],
        'MAXSTKQTY': this.angForm.value['MAXSTKQTY'],
        'RENTALPRICE' : 0,
        'VINNO': '',
        'NONSTKTYPEID': 0,
        'ITEM_LOC' : '',
        'MODEL' : '',
        'STKUOM' : this.angForm.value['STKUOM'],
        'NETWEIGHT' : this.angForm.value['NETWEIGHT'],
        'DISCOUNT' : 0,
        'USERFLD1' : 'N',
        'MINSPRICE' : this.angForm.value['MINSPRICE'],
        'ISACTIVE' : 'Y',
        'COST': this.angForm.value['PURCHASECOST'],
        'INVENTORYUOM' : this.angForm.value['INVENTORYUOM'],
        'PRD_CLS_ID': this.angForm.value['PRD_CLS_ID'],
        'PLANT' : this.root.getCompanyData()['PLANT'],
        'PRD_BRAND_ID' : this.angForm.value['PRD_BRAND_ID'],
        'SERVICEUOM' : this.angForm.value['INVENTORYUOM'],
        'CRBY' : this.root.getUserData()['USER_ID'],
        'UNITPRICE' : this.angForm.value['UnitPrice'],
        'PRODGST' : '',
        'COO': '',
        'SALESUOM': this.angForm.value['SALESUOM'],
        'PURCHASEUOM' : this.angForm.value['PURCHASEUOM'],
        'SERVICEPRICE' : 0,
        'GROSSWEIGHT' : 0,
        'ISBASICUOM' : 1,
        'ITEMTYPE' : this.angForm.value['ITEMTYPE'],
        'CATLOGPATH' : '',
        'HSCODE' : '',
        'RENTALUOM' : this.angForm.value['SALESUOM'],
        'REMARK4' : 0,
        'REMARK3' : 0,
        'STKQTY' : this.angForm.value['STKQTY'],
        'CRAT' : this.root.getCompanyData()['CRAT'],
        'REMARK1': '',
        'NONSTKFLAG' : this.angForm.value['NONSTKFLAG'],
        'ITEMDESC' : this.angForm.value['ITEMDESC'],
      }
  
      this.productapi.update_Product(data).then((data:any)=>{
        if(data['status']){
          this.addCustomerHideShow = false;
          this.angForm.reset();
          this.getAllProduct();
          this.messageService.add({severity:'success', summary:'Product Updated Successfully', detail:''});
        }
        else{
          this.messageService.add({severity:'error', summary:'Error in Updating Product', detail:''});
        }
      });
  }
  }

}


