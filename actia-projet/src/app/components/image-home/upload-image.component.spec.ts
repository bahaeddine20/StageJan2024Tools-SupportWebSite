// src/app/components/image-home/image-home.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {} from '@angular/common/http/testing';
import { ImageUploadComponent } from './upload-image.component';
import { ImageService } from '../../_services/ImageHome/image.service';
import { of } from 'rxjs';
import { ImageUploadModule } from '../../modules/Image-Home/upload-image.model';

describe('ImageUploadComponentt', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});