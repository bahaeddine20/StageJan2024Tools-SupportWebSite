import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainUserComponent } from './components/User/main-user/main-user.component';
import { ErrorComponent } from './components/error/error.component';
import { AboutUsComponent } from './components/User/about-us/about-us.component';
import { MapsComponent } from './components/User/maps/maps.component';
import { DetailsActiviteComponent } from './components/User/details-activite/details-activite.component';
import { MainAdminComponent } from './components/Admin/main-admin/main-admin.component';
import { LoginComponent } from './components/login/login.component';
import { ActiviteDComponent } from './components/Admin/activite-d/activite-d.component';
import { ShowActivitiesComponent } from './components/Admin/show-activities/show-activities.component';
import { AddActivitiesComponent } from './components/Admin/add-activities/add-activities.component';
import { ModifActivitiesComponent } from './components/Admin/modif-activities/modif-activities.component';
import { AddPersonneComponent } from './components/Admin/add-personne/add-personne.component';
import { ModifPersonneComponent } from './components/Admin/modif-personne/modif-personne.component';
import { authGuard } from './gaurd/auth.guard';
import { ContenairComponent } from './components/Admin/Contenair/contenair/contenair.component'; 
import { ChangerMDPComponent } from './components/Admin/Changer-MDP/changer-mdp/changer-mdp.component';
import { ChangerUsernameComponent } from './components/Admin/Changer-Username/changer-username/changer-username.component';

const routes: Routes = [
  {path:'mainU', title:'Main User', component:MainUserComponent},
  {path:'', redirectTo:'mainU', pathMatch:'full'},
  {path:'login', title:'Log In', component:LoginComponent},
  {path:'admin', title:'Admin', component:ContenairComponent, canActivate:[authGuard],
  children:[
    {path:'mainA', title:'Main Admin', component:MainAdminComponent},
    {path:'', redirectTo:'/admin/mainA', pathMatch:'full'},
    {path:'detailsA/:id', title:'Admin Details', component:ActiviteDComponent},
    {path:'showA', title:'Show Activity', component:ShowActivitiesComponent},
    {path:'addA', title:'Add Activity', component:AddActivitiesComponent},
    {path:'modifA/:id', title:'Modif Activity', component:ModifActivitiesComponent},
    {path:'addP/:id', title:'Add Person', component:AddPersonneComponent},
    {path:'modifP/:id/:id2', title:'Modif Person', component:ModifPersonneComponent},  
    {path:'changerMDP', title:'Changer MDP', component:ChangerMDPComponent},  
    {path:'changerUsername', title:'Changer Username', component:ChangerUsernameComponent},  
  ]
  },
  {path:'aboutUs', title:'About Us', component:AboutUsComponent},
  {path:'maps', title:'Maps', component:MapsComponent},
  {path:'details/:identif', title:'Activity Details', component:DetailsActiviteComponent},
  {path:'**',title:'Erreur', component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
