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


export function futureOrPresentDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to only compare date parts
    const controlDate = new Date(control.value);
    if (controlDate < currentDate) {
      return { 'pastDate': { value: control.value } };
    }
    return null;
  };
}

export function startDateBeforeEndDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const startDate = new Date(control.get('startDate')?.value);
    const endDate = new Date(control.get('endDate')?.value);
    if (startDate > endDate) {
      return { 'startDateAfterEndDate': { value: control.value } };
    }
    return null;
  };
}
