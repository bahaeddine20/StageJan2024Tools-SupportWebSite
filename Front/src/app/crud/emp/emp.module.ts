import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadComponent } from '../read/read.component';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from '../../app-routing.module';
import { EmpAddEditComponent } from '../emp-add-edit/emp-add-edit.component';
import { SharedModule } from "../../shared/shared.module";
import { NgxPaginationModule } from 'ngx-pagination';
import { TeamAddEditComponent } from '../team-add-edit/team-add-edit.component';
import { TeamReadComponent } from '../team-read/team-read.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [
        ReadComponent,
        EmpAddEditComponent,
        TeamAddEditComponent,
        TeamReadComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatSelectModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,
        HttpClientModule,
        SharedModule,
        NgxPaginationModule,
        MatCardModule,
        
    ],
    providers:[],
    bootstrap:[ReadComponent],
})
export class EmpModule { }
