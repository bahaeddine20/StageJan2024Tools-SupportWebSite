import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { ProfilComponent } from './modules/profil/profil.component';
import { LeaveRequestComponent } from './modules/leave-request/leave-request.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './modules/login/login.component';
import { TeamsComponent } from './modules/crud/teams/teams.component';
import { EmployeesComponent } from './modules/crud/employees/employees.component';
import { MapsComponent } from './modules/maps/maps.component';
import { RequestResetPasswordComponent } from './modules/login/request-reset-password/request-reset-password.component';
import { ResetPasswordGuard } from './_services/reset-password.guard';
import { ImageawsComponent } from './modules/imageaws/imageaws.component';
import { AuthorizationRequestsComponent } from './modules/authorization-requests/authorization-requests.component';
import { AuthGuard } from './_services/loginService/auth.guard';
import { CongeTableComponent } from './modules/conge-table/conge-table.component';
import { LeaveRequestListComponent } from './modules/leave-request-list/leave-request-list.component';
import { ImageUploadComponent } from './components/image-home/upload-image.component'; // Importation du composant
import { SprintListComponent } from './modules/sprint-list/sprint-list.component';
import { SprintFormComponent } from './modules/sprint-form/sprint-form.component';
import { DataPerfJiraDetailsComponent } from './modules/data-perf-jira-details/data-perf-jira-details.component';
import { SprintCreateComponent } from './modules/sprint-create/sprint-create.component';
import { DataPerfJiraTableComponent } from './modules/data-perf-jira-table/data-perf-jira-table.component';
import { EditSprintComponent } from './modules/edit-sprint/edit-sprint.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'request-reset-password', component: RequestResetPasswordComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],  // Appliquez AuthGuard au layout
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'profile', component: ProfilComponent },
            { path: 'list', component: TeamsComponent },
            { path: 'congé/:teamId', component: LeaveRequestComponent },
            { path: 'employees/:teamId', component: EmployeesComponent },
            { path: 'maps', component: MapsComponent },
            { path: 'employees', component: EmployeesComponent },
            { path: 'boutton', component: ImageawsComponent },
            { path: 'authorization', component: AuthorizationRequestsComponent },
            { path: 'congee/:teamId', component: CongeTableComponent },
            { path: 'leave-requests', component: LeaveRequestListComponent },
            { path: 'ImageUploadComponent', component: ImageUploadComponent }
                 ,{ path: 'sprints/:teamId', component: SprintListComponent },
            { path: 'sprintForm/:idsprint', component: SprintFormComponent },   
             { path: 'data-table/:idsprint', component: DataPerfJiraTableComponent },
            { path: 'data-perf-jira-details/:id', component: DataPerfJiraDetailsComponent },
            { path: 'sprints/:teamId/edit/:sprintId', component: EditSprintComponent }, // Correct route for SprintEditComponent


            { path: 'data-perf-jira-details/:id', component: DataPerfJiraDetailsComponent },

            { path: 'sprint_Create/:teamId', component: SprintCreateComponent }// Use the correct class name
        ]
    }
];
