import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no requests are outstanding after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve public content', () => {
    const testData = 'public content';

    service.getPublicContent().subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test/all');
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('should retrieve user board content', () => {
    const testData = 'user board content';

    service.getUserBoard().subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test/user');
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('should retrieve moderator board content', () => {
    const testData = 'moderator board content';

    service.getModeratorBoard().subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test/mod');
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('should retrieve admin board content', () => {
    const testData = 'admin board content';

    service.getAdminBoard().subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/test/admin');
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });
});
