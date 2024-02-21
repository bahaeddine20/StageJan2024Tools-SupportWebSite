import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenairComponent } from './contenair.component';

describe('ContenairComponent', () => {
  let component: ContenairComponent;
  let fixture: ComponentFixture<ContenairComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContenairComponent]
    });
    fixture = TestBed.createComponent(ContenairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
