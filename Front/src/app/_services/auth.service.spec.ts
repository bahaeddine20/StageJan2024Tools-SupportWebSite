import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send a POST request with username and password', () => {
      const mockResponse = { token: 'mockToken' };
      const username = 'testUser';
      const password = 'testPassword';

      service.login(username, password).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:9091/api/auth/signin');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });
      req.flush(mockResponse);
    });
  });

  describe('register', () => {
    it('should send a POST request with username, email, and password', () => {
      const mockResponse = { message: 'User registered successfully' };
      const username = 'testUser';
      const email = 'test@example.com';
      const password = 'testPassword';

      service.register(username, email, password).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:9091/api/auth/signup');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, email, password });
      req.flush(mockResponse);
    });
  });
});
