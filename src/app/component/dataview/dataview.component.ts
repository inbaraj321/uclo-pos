import { Component, OnInit, Input } from '@angular/core';
import { ProductApiService} from '../../services/product-api.service';
import { RootService} from '../../services/root.service';
import { PosService} from '../../services/pos.service';
import { MessageService} from 'primeng/api';


@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.scss'],
  providers: [MessageService]
})
export class DataviewComponent implements OnInit {

  @Input() public AllProduct:any;
  @Input() public prdType:any;
  @Input() public prdClass:any;
  @Input() public prdBrand:any;
  public virtualProducts: any;
  public typegrid: string = 'grid';
  public property: string = '';
  public openFilter :boolean = false;
  public class: string = '';
  public type: string = '';
  public brand: string = '';

  public blocked: boolean = false;

  constructor(
    private productapi: ProductApiService,
    public possrv: PosService,
    private messageService: MessageService,
    public root: RootService) {
  }

  ngOnInit(): void {
    this.virtualProducts = JSON.parse(JSON.stringify(this.AllProduct));
  }

 

  search(dv:any){

   

    if(this.property && this.property !== ''){
      dv.filter(this.property, 'contains');
    }
    else{
      dv.filteredValue = this.AllProduct;
    }

    if(this.class && this.class !== ''){
      dv.filteredValue = dv.filteredValue.filter((o:any) => {
        return o['PRD_CLS_ID'] == this.class;
      });
    }

    if(this.type && this.type !== ''){
      dv.filteredValue = dv.filteredValue.filter((o:any) => {
        return o['ITEMTYPE'] == this.type;
      });
    }

    if(this.brand && this.brand !== ''){
      dv.filteredValue = dv.filteredValue.filter((o:any) => {
        return o['PRD_BRAND_ID'] == this.brand;
      });
    }
  
    
    if( dv.filteredValue && dv.filteredValue.length == 1){
      this.selectProduct(dv.filteredValue[0]);
      dv.filter('');
      this.property = '';
      this.class = '';
      this.type = '';
      this.brand = '';
    }
  }

  selectProduct(item:any){

    this.blocked = true;
    
    if((item['availableQty'] == null || item['availableQty'] == 0) && item['NONSTKFLAG'] == 'N' ){
      this.messageService.add({severity:'error', summary:'Out OF Stock', detail:''});
      this.blocked = false;
      return;
    }
    var result = this.possrv.selectProduct(item);
    if(result == 'maxReachError'){
      this.messageService.add({severity:'error', summary:'Maximum Quantity Reached', detail:''});
      this.blocked = false;
    }
    if(result == 'maxSReachError'){
      this.messageService.add({severity:'error', summary:'Maximum Selling Quantity Reached', detail:''});
      this.blocked = false;
    }
    setTimeout(() => {
      this.blocked = false;
    }, 1000);
  }

}
