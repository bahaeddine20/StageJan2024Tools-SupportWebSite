import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee, EmployeeImage } from '../employee';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EmpAddEditComponent } from '../emp-add-edit/emp-add-edit.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EmpcrudService } from '../services/empcrud.service';
import { CoreService } from '../core/core.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {
  selectedFileUrl: any = null;
  displayedColumns: string[] = [
    'id',
    'firstname',
    'lastname',
    'email',
    'gender',
    'team',
    'photo',
    'action',
  ];


  roles: string[] = [];
  isLoggedIn = false;

  dataSource!: MatTableDataSource<Employee>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private _dialog: MatDialog,
    private _empService: EmpcrudService,
    private _coreService: CoreService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const teamId = Number(param.get('teamId'));
      console.log("teamId:", teamId);
      this.getEmployeesByTeam(teamId);
    });
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

    }
  }

  getEmployeesByTeam(teamId: number) {
    this._empService.getByTeam(teamId.toString()).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }

  getEmployeeList() {
    this._empService.getAllEmployees().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.error,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Employee deleted!', 'done');
        location.reload();
        this.getEmployeeList();
      },
      error: console.error,
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data: { employee: data, selectedFileName: data.image ? data.image : null },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }

  getImageUrl(image: EmployeeImage): SafeUrl {
    if (image && image.picByte) {
      const imageUrl = 'data:' + image.type + ';base64,' + image.picByte;
      return this._sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return '';
  }

}
