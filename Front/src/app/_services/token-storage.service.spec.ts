import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and retrieve token', () => {
    const token = 'test-token';
    service.saveToken(token);
    expect(service.getToken()).toEqual(token);
  });

  it('should save and retrieve user', () => {
    const user = { id: 1, username: 'testuser' };
    service.saveUser(user);
    expect(service.getUser()).toEqual(user);
  });

  it('should return null if token is not available', () => {
    // Clear any existing token
    window.sessionStorage.removeItem('auth-token');
    expect(service.getToken()).toBeNull();
  });

  it('should return empty object if user is not available', () => {
    // Clear any existing user
    window.sessionStorage.removeItem('auth-user');
    expect(service.getUser()).toEqual({});
  });

  it('should clear session storage on sign out', () => {
    spyOn(window.sessionStorage, 'clear');
    service.signOut();
    expect(window.sessionStorage.clear).toHaveBeenCalled();
  });
});
