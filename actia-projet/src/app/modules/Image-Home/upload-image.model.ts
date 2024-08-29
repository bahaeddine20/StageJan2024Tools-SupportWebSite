import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from '../../components/image-home/upload-image.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ declarations: [
        ImageUploadComponent
    ],
    exports: [
        ImageUploadComponent
    ], imports: [CommonModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ImageUploadModule { }


