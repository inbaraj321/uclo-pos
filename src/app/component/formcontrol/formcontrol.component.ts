import { Component,ViewChild, ElementRef, OnInit, Input, AfterViewInit ,Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-formcontrol',
  templateUrl: './formcontrol.component.html',
  styleUrls: ['./formcontrol.component.scss']
})
export class FormcontrolComponent implements OnInit {

  @Input() angForm: any = [];
  @Input() formData: any = [];

  public selectedValues: boolean = false;

  constructor(private fb: FormBuilder,private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    console.log(this.formData);
  }

  applyuom(e:any){
    if(e.checked == true){
      this.angForm.controls['PURCHASEUOM'].setValue(this.angForm.controls['STKUOM'].value) 
      this.angForm.controls['SALESUOM'].setValue(this.angForm.controls['STKUOM'].value) 
      this.angForm.controls['INVENTORYUOM'].setValue(this.angForm.controls['STKUOM'].value) 
      this.cd.detectChanges();
    }
    else{
      this.angForm.controls['PURCHASEUOM'].setValue('') 
      this.angForm.controls['SALESUOM'].setValue('') 
      this.angForm.controls['INVENTORYUOM'].setValue('') 
      this.cd.detectChanges();
    }
  }

}
