import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteDComponent } from './activite-d.component';

describe('ActiviteDComponent', () => {
  let component: ActiviteDComponent;
  let fixture: ComponentFixture<ActiviteDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiviteDComponent]
    });
    fixture = TestBed.createComponent(ActiviteDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
