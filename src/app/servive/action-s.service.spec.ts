import { TestBed } from '@angular/core/testing';

import { ActionSService } from './action-s.service';

describe('ActionSService', () => {
  let service: ActionSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
