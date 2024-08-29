import { AbstractControl, ValidatorFn } from '@angular/forms';

export function timeRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const controlTime = new Date(control.value).getHours();
    if (controlTime < 9 || controlTime > 17) {
      return { 'timeRange': { value: control.value } };
    }
    return null;
  };
}