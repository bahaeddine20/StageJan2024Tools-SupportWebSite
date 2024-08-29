import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPerfJiraDetailsComponent } from './data-perf-jira-details.component';

describe('DataPerfJiraDetailsComponent', () => {
  let component: DataPerfJiraDetailsComponent;
  let fixture: ComponentFixture<DataPerfJiraDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPerfJiraDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataPerfJiraDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
