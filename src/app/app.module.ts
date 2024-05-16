import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainAdminComponent } from './components/Admin/main-admin/main-admin.component';
import { MainUserComponent } from './components/User/main-user/main-user.component';
import { AddActivitiesComponent } from './components/Admin/add-activities/add-activities.component';
import { ModifActivitiesComponent } from './components/Admin/modif-activities/modif-activities.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';
import { AddPersonneComponent } from './components/Admin/add-personne/add-personne.component';
import { ShowActivitiesComponent } from './components/Admin/show-activities/show-activities.component';
import { MapsComponent } from './components/User/maps/maps.component';
import { DetailsActiviteComponent } from './components/User/details-activite/details-activite.component';
import { AboutUsComponent } from './components/User/about-us/about-us.component';
import { ActiviteDComponent } from './components/Admin/activite-d/activite-d.component';
import { ModifPersonneComponent } from './components/Admin/modif-personne/modif-personne.component';
import {HttpClientModule} from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import { ContenairComponent } from './components/Admin/Contenair/contenair/contenair.component';
import { ChangerMDPComponent } from './components/Admin/Changer-MDP/changer-mdp/changer-mdp.component';
import { ChangerUsernameComponent } from './components/Admin/Changer-Username/changer-username/changer-username.component';

@NgModule({
  declarations: [
    AppComponent,
    MainAdminComponent,
    MainUserComponent,
    AddActivitiesComponent,
    ModifActivitiesComponent,
    ErrorComponent,
    LoginComponent,
    AddPersonneComponent,
    ShowActivitiesComponent,
    MapsComponent,
    DetailsActiviteComponent,
    AboutUsComponent,
    ActiviteDComponent,
    ModifPersonneComponent,
    ContenairComponent,
    ChangerMDPComponent,
    ChangerUsernameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
