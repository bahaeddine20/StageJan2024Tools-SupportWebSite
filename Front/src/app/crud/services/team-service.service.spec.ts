import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamServiceService } from './team-service.service';
import {Team} from "../team";

describe('TeamServiceService', () => {
  let service: TeamServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamServiceService]
    });
    service = TestBed.inject(TeamServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve team by ID', () => {
    const dummyTeam = { id: 1, name: 'Team A' };

    service.getTeamById(1).subscribe(team => {
      expect(team).toEqual(dummyTeam);
    });

    const req = httpMock.expectOne('http://localhost:8089/team/getTeamById/1');
    expect(req.request.method).toEqual('GET');
    req.flush(dummyTeam);
  });

  it('should retrieve all teams', () => {
    const dummyTeams = [{ id: 1, name: 'Team A' }, { id: 2, name: 'Team B' }];

    service.getAllTeams().subscribe(teams => {
      expect(teams).toEqual(dummyTeams);
    });

    const req = httpMock.expectOne('http://localhost:8089/team/getAllTeams');
    expect(req.request.method).toEqual('GET');
    req.flush(dummyTeams);
  });

  it('should add a team', () => {
    const dummyTeamData: Team = {
      id: 1,
      name: 'Team A',
      description: 'Description of Team A',
      employees: []
    };
    const dummyImageFile = new File([''], 'test.jpg');

    service.addTeam(dummyTeamData, [dummyImageFile]).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8089/team/addTeam');
    expect(req.request.method).toEqual('POST');

    // Assert the request body
    const formData = req.request.body as FormData;
    const teamData = formData.get('team');
    const imagePath = formData.get('imagePath');

    // Check if the request body contains the expected team data
    expect(teamData).toEqual(JSON.stringify(dummyTeamData));

    // Check if the request body contains the image file
    expect(imagePath).toContain(dummyImageFile);

    req.flush({});
  });





  it('should update a team', () => {
    const dummyId = 1;
    const dummyTeamData: Team = {
      id: dummyId,
      name: 'Team A',
      description: 'Description of Team A',
      employees: [] // Provide an empty array or proper data for 'employees' property
    };
    const dummyImageFiles = [new File([''], 'test.jpg')];

    service.updateTeam(dummyId, dummyTeamData, dummyImageFiles).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:8089/team/updateTeam/${dummyId}`);
    expect(req.request.method).toEqual('PUT');
    const expectedFormData = new FormData();
    expectedFormData.append('team', JSON.stringify(dummyTeamData));
    dummyImageFiles.forEach(file => {
      expectedFormData.append('imagePath', file);
    });
    expect(req.request.body).toEqual(expectedFormData);
    req.flush({});
  });

  it('should delete a team', () => {
    const dummyId = 1;

    service.deleteTeam(dummyId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:8089/team/deleteTeamById/${dummyId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
