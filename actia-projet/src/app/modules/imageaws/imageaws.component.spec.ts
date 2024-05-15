import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageawsComponent } from './imageaws.component';

describe('ImageawsComponent', () => {
  let component: ImageawsComponent;
  let fixture: ComponentFixture<ImageawsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageawsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
