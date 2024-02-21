import { TestBed } from '@angular/core/testing';

import { AuthSService } from './auth-s.service';

describe('AuthSService', () => {
  let service: AuthSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
