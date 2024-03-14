import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmpcrudService } from './empcrud.service';
import {Team} from "../team";

describe('EmpcrudService', () => {
  let service: EmpcrudService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmpcrudService]
    });
    service = TestBed.inject(EmpcrudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve employee by ID', () => {
    const dummyEmployee = { id: 1, name: 'John Doe' };

    service.getEmployeeById(1).subscribe(employee => {
      expect(employee).toEqual(dummyEmployee);
    });

    const req = httpMock.expectOne('http://localhost:8089/emp/getEmployeeByID/1');
    expect(req.request.method).toEqual('GET');
    req.flush(dummyEmployee);
  });

  it('should retrieve all employees', () => {
    const dummyEmployees = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }];

    service.getAllEmployees().subscribe(employees => {
      expect(employees).toEqual(dummyEmployees);
    });

    const req = httpMock.expectOne('http://localhost:8089/emp/getAllEmployees');
    expect(req.request.method).toEqual('GET');
    req.flush(dummyEmployees);
  });

  it('should add an employee', () => {
    const dummyEmployeeData = { name: 'John Doe' };
    const dummyImageFiles = [new File([''], 'test.jpg')];

    service.addEmployee(dummyEmployeeData, dummyImageFiles).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8089/emp/addEmployee');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.get('employee')).toEqual(JSON.stringify(dummyEmployeeData));
    expect(req.request.body.get('imagePath')).toEqual(dummyImageFiles[0]);
    req.flush({});
  });

  it('should update an employee', () => {
    const dummyId = 1;
    const dummyEmployeeData = {
      id: dummyId,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      gender: 'male',
      team: { id: 1, name: 'Team A' } as Team // Include a valid Team object for the 'team' property
    };
    const dummyImageFiles = [new File([''], 'test.jpg')];

    service.updateEmployee(dummyId, dummyEmployeeData, dummyImageFiles).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:8089/emp/updateEmployee/${dummyId}`);
    expect(req.request.method).toEqual('PUT');
    const expectedFormData = new FormData();
    expectedFormData.append('employee', JSON.stringify(dummyEmployeeData));
    dummyImageFiles.forEach(file => {
      expectedFormData.append('imagePath', file, file.name);
    });
    expect(req.request.body).toEqual(expectedFormData);
    req.flush({});
  });

  it('should delete an employee', () => {
    const dummyId = 1;

    service.deleteEmployee(dummyId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:8089/emp/deleteEmployeeById/${dummyId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should search employees by gender', () => {
    const dummyGender = 'male';
    const dummyResults = [{ id: 1, name: 'John Doe', gender: 'male' }];

    service.searchByGender(dummyGender).subscribe(results => {
      expect(results).toEqual(dummyResults);
    });

    const req = httpMock.expectOne(`http://localhost:8089/emp/searchByGender/${dummyGender}`);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResults);
  });

  it('should get employees by team', () => {
    const dummyTeamId = 'team1';
    const dummyResults = [{ id: 1, name: 'John Doe', teamId: 'team1' }];

    service.getByTeam(dummyTeamId).subscribe(results => {
      expect(results).toEqual(dummyResults);
    });

    const req = httpMock.expectOne(`http://localhost:8089/emp/EmployeeByIdTeam/${dummyTeamId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResults);
  });

  it('should search employees by birth date range', () => {
    const dummyStartDate = '2022-01-01';
    const dummyEndDate = '2022-12-31';
    const dummyResults = [{ id: 1, name: 'John Doe', birthDate: '2022-06-15' }];

    service.searchByBirthDateRange(dummyStartDate, dummyEndDate).subscribe(results => {
      expect(results).toEqual(dummyResults);
    });

    const req = httpMock.expectOne(`http://localhost:8089/emp/searchByBirthDateRange/${dummyStartDate}/${dummyEndDate}`);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResults);
  });

  it('should get all teams', () => {
    const dummyTeams = [{ id: 'team1', name: 'Team 1' }];

    service.getTeams().subscribe(teams => {
      expect(teams).toEqual(dummyTeams);
    });

    const req = httpMock.expectOne('http://localhost:8089/team/getAllTeams');
    expect(req.request.method).toEqual('GET');
    req.flush(dummyTeams);
  });

  it('should search employees by birth year', () => {
    const dummyYear = 1990;
    const dummyResults = [{ id: 1, name: 'John Doe', birthYear: 1990 }];

    service.searchByBirthYear(dummyYear).subscribe(results => {
      expect(results).toEqual(dummyResults);
    });

    const req = httpMock.expectOne(`http://localhost:8089/emp/searchByBirthYear/${dummyYear}`);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResults);
  });
});
