import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationRequestsComponent } from './authorization-requests.component';

describe('AuthorizationRequestsComponent', () => {
  let component: AuthorizationRequestsComponent;
  let fixture: ComponentFixture<AuthorizationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorizationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
