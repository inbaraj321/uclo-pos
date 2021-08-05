import { Component, OnInit } from '@angular/core';
import { PosApiService } from '../services/pos-api.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any;
  showchat: boolean = false;

  sale:any = [];
  tax:any = [];
  discound:any = [];

  constructor(private PosApiService: PosApiService, ) { 
    this.data = {
      labels: this.getLast3Months(),
            datasets: [
                {
                    label: 'Tax',
                    backgroundColor: '#42A5F5',
                    data: this.tax
                },
                {
                    label: 'Discound',
                    backgroundColor: '#FFA726',
                    data: this.discound
                },
                {
                    label: 'Sales',
                    backgroundColor: '#5dba4a',
                    data: this.sale
                }
            ]
            }
    
  }

  getLast3Months() {

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    var today = new Date();
    var last3Months = []
  
    for (var i = 0; i < 6; i++) {
      last3Months.push(monthNames[(today.getMonth() - i)] );
    }
    return last3Months;
  }

  ngOnInit(): void {
    this.PosApiService.get_dashboardData().then(data=>{
      var today = new Date();
    
      for (var i = 0; i < 6; i++) {
          this.sale.push( data['sumSalesAmount'][i].TOTALNAME );
          this.discound.push( data['get_sumDISCOUNTAmount'][i].TOTALNAME );
          this.tax.push( data['get_sumTAXAMOUNTAmount'][i].TOTALNAME );   
      }
      this.showchat = true;
      $('body').click();
      console.log(this.sale);
    });
  }
  
  selectData(event: any) {}
}
