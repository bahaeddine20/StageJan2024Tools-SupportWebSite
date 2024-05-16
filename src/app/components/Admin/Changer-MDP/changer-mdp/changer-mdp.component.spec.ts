import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangerMDPComponent } from './changer-mdp.component';

describe('ChangerMDPComponent', () => {
  let component: ChangerMDPComponent;
  let fixture: ComponentFixture<ChangerMDPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangerMDPComponent]
    });
    fixture = TestBed.createComponent(ChangerMDPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
