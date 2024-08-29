import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour les directives de base
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-image-upload',
  templateUrl: './upload-image.component.html',
  standalone: true,
  imports: [CommonModule] // Ajouter CommonModule ici
})
export class ImageUploadComponent implements OnInit {
  selectedFile: File | null = null;
  uploadProgress = 0;
  message = '';
  images: any[] = [];  // Liste des images

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService,private router: Router) {}

  ngOnInit(): void {
    this.getImages();
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
  
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      });
  
      this.http.post('http://localhost:8080/api/images/api/images/uploadHome', formData, {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = 'Image uploaded successfully!';
            this.getImages();  // Recharger la liste des images après upload
  
            // Afficher le message pendant 30 secondes
            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.message = 'Error uploading image.';
  
          // Réinitialiser le message après 30 secondes
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      });
    } else {
      this.message = 'Please select a file first.';
  
      // Réinitialiser le message après 30 secondes
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
  
  navigateBack(): void {
    this.router.navigate(['/home']); // Remplacez '/home' par la route souhaitée
  }
  getImages(): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    this.http.get<any[]>('http://localhost:8080/api/images/getall', { headers }).subscribe({
      next: (data: any[]) => {
        this.images = data;
      },
      error: (error) => {
        console.error('Error fetching images:', error);
      }
    });
  }

  deleteImage(id: number): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    this.http.delete(`http://localhost:8080/api/images/${id}`, { headers }).subscribe(() => {
      this.getImages();  // Recharger la liste des images après suppression
    });
  }

  getImageUrl(id: number): string {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
  
    // Note: this URL is used to fetch image data and typically needs to be used with HttpClient requests
    // You may not need headers here if you are using the URL directly for an <img> src attribute.
    return `http://localhost:8080/api/images/${id}`;
  }
  
}
