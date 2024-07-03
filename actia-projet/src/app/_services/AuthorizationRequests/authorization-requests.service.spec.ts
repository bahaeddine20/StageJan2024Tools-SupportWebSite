import { TestBed } from '@angular/core/testing';

import { AuthorizationRequestsService } from './authorization-requests.service';

describe('AuthorizationRequestsService', () => {
  let service: AuthorizationRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
