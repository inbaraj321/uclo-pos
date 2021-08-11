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
      this.angForm.controls['purchaseUom'].setValue(this.angForm.controls['stackUom'].value) 
      this.angForm.controls['salesUom'].setValue(this.angForm.controls['stackUom'].value) 
      this.angForm.controls['inventoryUom'].setValue(this.angForm.controls['stackUom'].value) 
      this.cd.detectChanges();
    }
    else{
      this.angForm.controls['purchaseUom'].setValue('') 
      this.angForm.controls['salesUom'].setValue('') 
      this.angForm.controls['inventoryUom'].setValue('') 
      this.cd.detectChanges();
    }
  }

}
