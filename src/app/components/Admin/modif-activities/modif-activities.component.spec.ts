import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifActivitiesComponent } from './modif-activities.component';

describe('ModifActivitiesComponent', () => {
  let component: ModifActivitiesComponent;
  let fixture: ComponentFixture<ModifActivitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifActivitiesComponent]
    });
    fixture = TestBed.createComponent(ModifActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
