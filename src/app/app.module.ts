import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS,  } from '@angular/common/http';
import { CommonModule, LocationStrategy,  HashLocationStrategy} from '@angular/common';
import { TokenInterceptor } from './services/token.interceptor';
import { AuthGuard } from './auth.guard';
import { PrimengModule } from './primeng/primeng.module';
import { FallbackImgDirective} from './fallback-img.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgxPrintModule } from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { ChartModule } from 'primeng/chart';
import {FileUploadModule} from 'primeng/fileupload';

import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component'
/* Theme */
import { HeaderComponent } from './theme/header/header.component';
import { SidebarComponent } from './theme/sidebar/sidebar.component';
import { FooterComponent } from './theme/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PosComponent } from './pos/pos.component';
import { TableComponent } from './component/table/table.component';
import { DataviewComponent } from './component/dataview/dataview.component';
import { PosTabelComponent } from './component/pos-tabel/pos-tabel.component';
import { FormcontrolComponent } from './component/formcontrol/formcontrol.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SaleslistComponent } from './saleslist/saleslist.component';
import { InvoiceprintComponent } from './invoiceprint/invoiceprint.component';
import { SalesDraftComponent } from './sales-draft/sales-draft.component';
import { CustomerComponent } from './customer/customer.component';
import { BarcoderComponent } from './barcoder/barcoder.component';
import { ReturnitemComponent } from './returnitem/returnitem.component';

/* Theme */


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    DashboardComponent,
    PosComponent,
    TableComponent,
    DataviewComponent,
    FallbackImgDirective,
    PosTabelComponent,
    FormcontrolComponent,
    ProductListComponent,
    SaleslistComponent,
    InvoiceprintComponent,
    SalesDraftComponent,
    CustomerComponent,
    BarcoderComponent,
    ReturnitemComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    NgxPrintModule,
    NgxBarcode6Module,
    ReactiveFormsModule,
    HttpClientModule,
    PrimengModule,
    FileUploadModule,
    ChartModule,
    MatButtonModule,
    NgxBarcodeModule,
    MatKeyboardModule,
    MatAutocompleteModule,
  ],
  providers: [
    {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor, 
        multi: true
    }, 
    AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
