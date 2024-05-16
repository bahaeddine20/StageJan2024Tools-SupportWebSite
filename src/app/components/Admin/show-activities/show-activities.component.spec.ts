import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowActivitiesComponent } from './show-activities.component';

describe('ShowActivitiesComponent', () => {
  let component: ShowActivitiesComponent;
  let fixture: ComponentFixture<ShowActivitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowActivitiesComponent]
    });
    fixture = TestBed.createComponent(ShowActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
