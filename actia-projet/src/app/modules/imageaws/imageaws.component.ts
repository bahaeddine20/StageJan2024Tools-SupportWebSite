import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-imageaws',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './imageaws.component.html',
  styleUrls: ['./imageaws.component.scss']
})
export class ImageawsComponent implements OnInit {
  imageUrls: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadImageUrls();
  }

  loadImageUrls() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}` // Use the getToken method
    });

    const bucketUrl = 'https://rania-actia-bucket.s3.amazonaws.com/';

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
    console.log('Retrieved token:', token); // This will log the token to your console
    return token;
  }
  isOddAndLast(index: number): boolean {
    return this.imageUrls.length % 2 !== 0 && index === this.imageUrls.length - 1;
  }
  
}
