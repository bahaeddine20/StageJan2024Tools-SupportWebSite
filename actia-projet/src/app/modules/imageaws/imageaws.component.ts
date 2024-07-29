import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { TranslationModule } from '../../translation/translation.module';
import { LanguageService } from '../../_services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-imageaws',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslationModule
  ],
  templateUrl: './imageaws.component.html',
  styleUrls: ['./imageaws.component.scss']
})
export class ImageawsComponent implements OnInit {
  imageUrls: string[] = [];
  sprintName!: string;
  startDate!: string;
  endDate!: string;
  carryForwardSp!: string;
  roles: string[] = [];
  isLoggedIn = false;
  user: any;

  excelFile!: File;
  velocityFile!: File;
  carryFile!: File;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.languageService.currentLanguage.subscribe(language => {
      this.translate.use(language);
    });
  }

  switchLanguage(language: string) {
    this.languageService.changeLanguage(language);
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
      this.roles = this.user.roles;

      console.log('Is Logged In:', this.isLoggedIn);
      console.log('Roles:', this.roles);
    }
    this.loadImageUrls();
    this.loadUserRoles();
  }

  onSubmit() {
    const data = {
      sprintName: this.sprintName,
      startDate: this.startDate,
      endDate: this.endDate,
      carryForwardSp: this.carryForwardSp
    };

    this.http.post('http://localhost:5000/run-python-script', data)
      .subscribe(response => {
        console.log('Response:', response);
      }, error => {
        console.error('Error:', error);
      });
  }

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'excel') {
      this.excelFile = file;
    } else if (fileType === 'velocity') {
      this.velocityFile = file;
    } else if (fileType === 'carry') {
      this.carryFile = file;
    }
  }

  onFileUpload(file: File, fileType: string) {
    const formData = new FormData();
    formData.append('file', file);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  
    let uploadUrl = '';
    if (fileType === 'excel') {
      uploadUrl = 'http://localhost:8080/api/files/upload/excel';
    } else if (fileType === 'velocity') {
      uploadUrl = 'http://localhost:8080/api/files/upload/velocity';
    } else if (fileType === 'carry') {
      uploadUrl = 'http://localhost:8080/api/files/upload/carry';
    }
  
    this.http.post(uploadUrl, formData, { headers }).subscribe(response => {
      console.log('File upload response:', response);
    }, error => {
      console.error('File upload error:', error);
    });
  }
  

  loadImageUrls() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    const bucketUrl = 'https://rania-actia-bucket.s3.amazonaws.com/';

    this.imageUrls = [];

    this.http.get<string[]>('http://localhost:8080/api/images/list', { headers })
      .subscribe({
        next: (response) => {
          if (Array.isArray(response) && response.length > 0) {
            this.imageUrls = response.map(filename => bucketUrl + filename);
          } else {
            console.error('No images found or invalid response:', response);
          }
        },
        error: (error) => {
          console.error('Error fetching image URLs:', error);
        }
      });
  }

  openImage(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  private getToken(): string {
    const token = localStorage.getItem('accessToken') || '';
    console.log('Retrieved token:', token);
    return token;
  }

  isOddAndLast(index: number): boolean {
    return this.imageUrls.length % 2 !== 0 && index === this.imageUrls.length - 1;
  }

  private loadUserRoles() {
    const roles = localStorage.getItem('userRoles');
    if (roles) {
      this.roles = JSON.parse(roles);
    }
  }
}
