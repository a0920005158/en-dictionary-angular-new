import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterChecked'
})
export class FilterCheckedPipe implements PipeTransform {

  transform(value: any[]): boolean {
    let test = value.filter(x => x.checked == true).length;
    if(test > 2){
      return true;
    }
    return false
  }

}
