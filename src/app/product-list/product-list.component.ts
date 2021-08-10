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
    this.angForm.controls['item'].setValue(e['item']);
    this.angForm.controls['nonStackFlag'].setValue(e['nonStackFlag']);
    this.angForm.controls['itemDescription'].setValue(e['itemDescription']);
    this.angForm.controls['stackUom'].setValue(e['stackUom']);
    this.angForm.controls['netWeight'].setValue(e['netWeight']);
    this.angForm.controls['grossWeight'].setValue(e['grossWeight']);
    this.angForm.controls['productClassId'].setValue(e['productClassId']);
    this.angForm.controls['itemType'].setValue(e['itemType']);
    this.angForm.controls['productBrandId'].setValue(e['productBrandId']);
    this.angForm.controls['purchaseUom'].setValue(e['purchaseUom']);
    this.angForm.controls['cost'].setValue(e['cost']);
    this.angForm.controls['salesUom'].setValue(e['salesUom']);
    this.angForm.controls['minsPrice'].setValue(e['minsPrice']);
    this.angForm.controls['unitPrice'].setValue(e['unitPrice']);
    this.angForm.controls['inventoryUom'].setValue(e['inventoryUom']);
    this.angForm.controls['stackQuantity'].setValue(e['stackQuantity']);
    this.angForm.controls['maximumStackQuantity'].setValue(e['maximumStackQuantity']);
    this.angForm.controls['catalogPath'].setValue(e['catalogPath']);
    this.angForm.controls['addoredit'].setValue('edit');
    this.addCustomerHideShow = true;
  }

  printBarcode(e:any){
    this.router.navigateByUrl('barcode/'+ e?.item);
  }

  createform(){
    this.angForm = this.fb.group({
      item: ['', Validators.required],
      nonStackFlag: ['Y', Validators.required],
      itemDescription: ['', Validators.required],
      stackUom: ['', Validators.required],
      netWeight: [''],
      grossWeight: [''],
      productClassId: ['', Validators.required],
      itemType: ['', Validators.required],
      productBrandId: ['', Validators.required],
      purchaseUom: ['', Validators.required],
      cost: ['', Validators.required],
      salesUom: ['', Validators.required],
      minsPrice: [''],
      unitPrice: [''],
      inventoryUom: ['', Validators.required],
      stackQuantity: ['', Validators.required],
      maximumStackQuantity: [''],
      catalogPath: [''],
      addoredit: [''],
      
    });
  }

  runForm(){

    var stock = [
      {'name': 'Stock', 'code':'Y'},
      {'name': 'Non-Stock', 'code':'N'}
    ]
    this.formData = [
      { 'col': 6, 'name': 'item', 'type': 'text', 'lable': 'Product Id *' },
      { 'col': 6, 'name': 'itemDescription', 'type': 'text', 'lable': 'Description *' },
      { 'col': 6, 'name': 'nonStackFlag', 'type': 'dropdown', 'lable': 'Stock Type *', 'options':stock, 'optionLabel':'name', 'optionValue':'code' },
      { 'col': 6, 'name': 'stackUom', 'type': 'uom', 'lable': 'Base UOM *', 'options':this.UOM, 'optionLabel':'qpUom', 'optionValue':'uom' },
      { 'col': 6, 'name': 'netWeight', 'type': 'number', 'lable': 'Net Weight (KG)' },
      { 'col': 6, 'name': 'grossWeight', 'type': 'number', 'lable': 'Gross Weight (KG)' },
      { 'col': 6, 'name': 'productClassId', 'type': 'dropdown', 'lable': 'Product Class *', 'options':this.prdClass, 'optionLabel':'prdClsDesc', 'optionValue':'prdClsId' },
      { 'col': 6, 'name': 'itemType', 'type': 'dropdown', 'lable': 'Product Type *', 'options':this.prdType, 'optionLabel':'prdTypeDesc', 'optionValue':'PrdTypeId'  },
      { 'col': 6, 'name': 'productBrandId', 'type': 'dropdown', 'lable': 'Product Brand *', 'options':this.prdBrand, 'optionLabel':'prdBrandDesc', 'optionValue':'prdBrandId'},
      
      { 'col': 12, 'type': 'heading', 'lable': 'Purchase' },
      { 'col': 6, 'name': 'purchaseUom', 'type': 'dropdown', 'lable': 'Purchase UOM *', 'options':this.UOM, 'optionLabel':'qpUom', 'optionValue':'uom' },
      { 'col': 6, 'name': 'cost', 'type': 'number', 'lable': 'Purchase Cost *' },

      { 'col': 12, 'type': 'heading', 'lable': 'Sales' },
      { 'col': 6, 'name': 'salesUom', 'type': 'dropdown', 'lable': 'Sales UOM *', 'options':this.UOM, 'optionLabel':'qpUom', 'optionValue':'uom' },
      { 'col': 6, 'name': 'minsPrice', 'type': 'number', 'lable': 'Minimum Selling Price' },
      { 'col': 6, 'name': 'unitPrice', 'type': 'number', 'lable': 'List Price' },

      { 'col': 12, 'type': 'heading', 'lable': 'Inventory' },
      { 'col': 6, 'name': 'inventoryUom', 'type': 'dropdown', 'lable': 'Inventory UOM *', 'options':this.UOM, 'optionLabel':'qpUom', 'optionValue':'uom' },
      { 'col': 6, 'name': 'stackQuantity', 'type': 'number', 'lable': 'Min Stock Quantity' },
      { 'col': 6, 'name': 'maximumStackQuantity', 'type': 'number', 'lable': 'Max Stock Quantity' },
      { 'col': 12, 'name': 'catalogPath', 'type': 'image', 'lable': 'Catlog Image' },
    ];

  }


  openAddProduct(){
    this.angForm.reset();
    
    this.productapi.getProductInsertID().then(Product => {
      this.angForm.controls['item'].setValue(Product['result'].prodId);
      this.angForm.controls['addoredit'].setValue(null);
      this.angForm.controls['nonStackFlag'].setValue("Y");
      this.addCustomerHideShow = true;
    });
  }

  addProduct(){

      if(this.angForm.value['unitPrice'] < this.angForm.value['minsPrice']){
        this.messageService.add({severity:'error', summary:'List Price cannot be lower than minimum price', detail:''});
        return;
      }
      if(this.angForm.value['unitPrice'] < this.angForm.value['cost']){
        this.messageService.add({severity:'error', summary:'List Price cannot be lower than cost price', detail:''});
        return;
      }


    if(this.angForm.value['addoredit'] == null){
      this.productapi.getProductInsertID().then(Product => {
        var data = {
          'item': this.angForm.value['item'],
          'maximumStackQuantity': this.angForm.value['maximumStackQuantity'],
          'rentalPrice' : 0,
          'vinNo': '',
          'nonStackTypeId': 0,
          'itemLocation' : '',
          'model' : '',
          'stackUom' : this.angForm.value['stackUom'],
          'netWeight' : this.angForm.value['netWeight'],
          'discount' : 0,
          'userFieldOne' : 'N',
          'minsPrice' : this.angForm.value['minsPrice'],
          'isActive' : 'Y',
          'cost': this.angForm.value['cost'],
          'inventoryUom' : this.angForm.value['inventoryUom'],
          'productClassId': this.angForm.value['productClassId'],
          'plant' : this.root.getCompanyData()['plant'],
          'productBrandId' : this.angForm.value['productBrandId'],
          'serviceUom' : this.angForm.value['inventoryUom'],
          'crBy' : this.root.getUserData()['userId'],
          'unitPrice' : this.angForm.value['UnitPrice'],
          'productGst' : '',
          'coo': '',
          'salesUom': this.angForm.value['salesUom'],
          'purchaseUom' : this.angForm.value['purchaseUom'],
          'servicePrice' : 0,
          'grossWeight' : 0,
          'isBasicUom' : 1,
          'itemType' : this.angForm.value['itemType'],
          'catalogPath' : '',
          'hsCode' : '',
          'rentalUom' : this.angForm.value['salesUom'],
          'remarkFour' : 0,
          'remarkThree' : 0,
          'stackQuantity' : this.angForm.value['stackQuantity'],
          'crAt' : this.root.getCompanyData()['crAt'],
          'remarkOne': '',
          'nonStackFlag' : this.angForm.value['nonStackFlag'],
          'itemDescription' : this.angForm.value['itemDescription'],
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

      if(this.angForm.value['unitPrice'] < this.angForm.value['minsPrice']){
        this.messageService.add({severity:'error', summary:'List Price cannot be lower than minimum price', detail:''});
        return;
      }
      if(this.angForm.value['unitPrice'] < this.angForm.value['cost']){
        this.messageService.add({severity:'error', summary:'List Price cannot be lower than cost price', detail:''});
        return;
      }
      
      var data = {
        'item': this.angForm.value['item'],
        'maximumStackQuantity': this.angForm.value['maximumStackQuantity'],
        'rentalPrice' : 0,
        'vinNo': '',
        'nonStackTypeId': 0,
        'itemLocation' : '',
        'model' : '',
        'stackUom' : this.angForm.value['stackUom'],
        'netWeight' : this.angForm.value['netWeight'],
        'discount' : 0,
        'userFieldOne' : 'N',
        'minsPrice' : this.angForm.value['minsPrice'],
        'isActive' : 'Y',
        'cost': this.angForm.value['cost'],
        'inventoryUom' : this.angForm.value['inventoryUom'],
        'productClassId': this.angForm.value['productClassId'],
        'plant' : this.root.getCompanyData()['PLANT'],
        'productBrandId' : this.angForm.value['productBrandId'],
        'serviceUom' : this.angForm.value['inventoryUom'],
        'crBy' : this.root.getUserData()['userId'],
        'unitPrice' : this.angForm.value['UnitPrice'],
        'productGst' : '',
        'coo': '',
        'salesUom': this.angForm.value['salesUom'],
        'purchaseUom' : this.angForm.value['purchaseUom'],
        'servicePrice' : 0,
        'grossWeight' : 0,
        'isBasicUom' : 1,
        'itemType' : this.angForm.value['itemType'],
        'catalogPath' : '',
        'hsCode' : '',
        'rentalUom' : this.angForm.value['salesUom'],
        'remarkFour' : 0,
        'remarkThree' : 0,
        'stackQuantity' : this.angForm.value['stackQuantity'],
        'crAt' : this.root.getCompanyData()['crAt'],
        'remarkOne': '',
        'nonStackFlag' : this.angForm.value['nonStackFlag'],
        'itemDescription' : this.angForm.value['itemDescription'],
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


