import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
  let etat=localStorage.getItem("etat")
  if(etat=="connected"){
    return true
  }
  else{
    router.navigate(['/login'])
    return false
  }
};
