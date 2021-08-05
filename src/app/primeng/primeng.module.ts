import { NgModule } from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {SplitterModule} from 'primeng/splitter';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {DataViewModule} from 'primeng/dataview';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ButtonModule} from 'primeng/button';
import {BlockUIModule} from 'primeng/blockui';
import {ToastModule} from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TableModule} from 'primeng/table';
import {InputNumberModule} from 'primeng/inputnumber';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {InputMaskModule} from 'primeng/inputmask';
import { RippleModule } from 'primeng/ripple';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {CalendarModule} from 'primeng/calendar';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CheckboxModule} from 'primeng/checkbox';


const primengComp = [
  AccordionModule,
  SplitterModule,
  VirtualScrollerModule,
  DataViewModule,
  TooltipModule,
  InputTextModule,
  CardModule,
  AutoCompleteModule,
  ButtonModule,
  ConfirmDialogModule,
  BlockUIModule,
  ConfirmPopupModule,
  ToastModule,
  InputNumberModule,
  ProgressSpinnerModule,
  TableModule,
  DropdownModule,
  DialogModule,
  InputMaskModule,
  RippleModule,
  InputTextareaModule,
  ToggleButtonModule,
  CalendarModule,
  CheckboxModule
]

@NgModule({
  imports: [
    primengComp
  ],
  exports: [
    primengComp
  ]
})
export class PrimengModule { }
