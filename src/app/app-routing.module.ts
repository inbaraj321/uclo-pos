import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { PosComponent } from './pos/pos.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SaleslistComponent } from './saleslist/saleslist.component';
import { InvoiceprintComponent } from './invoiceprint/invoiceprint.component';
import { SalesDraftComponent } from './sales-draft/sales-draft.component';
import { CustomerComponent } from './customer/customer.component';
import { BarcoderComponent } from './barcoder/barcoder.component';
import { ReturnitemComponent } from './returnitem/returnitem.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'print-invoice/:invoiceid', component: InvoiceprintComponent, canActivate: [AuthGuard] },
  { path: 'barcode/:productID', component: BarcoderComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },      
      { path: 'pos/:invoiceid', component: PosComponent},
      { path: 'product', component: ProductListComponent},
      { path: 'sales', component: SaleslistComponent},
      { path: 'sales-draft', component: SalesDraftComponent},
      { path: 'all-customer', component: CustomerComponent},
      { path: 'return-of-investment', component: ReturnitemComponent},
    ]
  }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
