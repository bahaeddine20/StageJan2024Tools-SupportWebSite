import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPerfJiraTableComponent } from './data-perf-jira-table.component';

describe('DataPerfJiraTableComponent', () => {
  let component: DataPerfJiraTableComponent;
  let fixture: ComponentFixture<DataPerfJiraTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPerfJiraTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataPerfJiraTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
