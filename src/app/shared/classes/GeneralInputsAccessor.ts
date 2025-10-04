import { ControlValueAccessor } from "@angular/forms";

export class GeneralInputsAccessor implements ControlValueAccessor{
    input!: any;
    onChange: any = () => { };
    onTouched: any = () => { };
    constructor() { }
  
    writeValue(input: any): void {
      this.input = input;
    }
  
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
     
}