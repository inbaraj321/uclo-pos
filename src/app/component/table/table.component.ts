import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter  } from '@angular/core';
import { RootService } from '../../services/root.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() public tableData:any;
  @Input() public tableSchema:any;

  @Output() onclickEvent = new EventEmitter<string>();

  public mainSchema:any = [];
  public buttonSchema:any = [];
  public filters:any = [];

  lengthdata: number = 0;

  loading: boolean = true;


  constructor(public root: RootService,) { }

  ngOnInit(): void {
    this.mainSchema = this.tableSchema?.mainschema;   
    this.buttonSchema = this.tableSchema?.buttonSchema;   
  }

  ngAfterViewInit():void{
    this.loading = false;

    this.mainSchema.forEach((element:any) => {
      this.filters.push(element.field);
    });

    this.lengthdata = this.mainSchema.length;
  }

  clear(table: any) {
    table.clear();
  }

  returnvalue(e:any){
    return e.target.value;
  }

  onClickEvent(e: any, a:any) {
    var data :any = {
      'data': e,
      'action': a,
    }
    this.onclickEvent.next(data);
  }

}
