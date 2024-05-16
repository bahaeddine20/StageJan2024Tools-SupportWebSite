import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangerUsernameComponent } from './changer-username.component';

describe('ChangerUsernameComponent', () => {
  let component: ChangerUsernameComponent;
  let fixture: ComponentFixture<ChangerUsernameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangerUsernameComponent]
    });
    fixture = TestBed.createComponent(ChangerUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
