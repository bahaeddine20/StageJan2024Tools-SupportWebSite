import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PostsComponent } from './modules/posts/posts.component';
import { ReadComponent } from './crud/read/read.component';
import { TeamReadComponent } from './crud/team-read/team-read.component';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Add your signup route
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: DefaultComponent,// Protect the routes with the AuthGuard
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'home',
        component: PostsComponent
      },
      {
        path: 'list',
        component: TeamReadComponent,
      },

      {
        path: 'employees/:teamId',
        component: ReadComponent
      }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
