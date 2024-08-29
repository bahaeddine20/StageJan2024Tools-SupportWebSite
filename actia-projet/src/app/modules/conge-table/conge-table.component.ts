import { Component, OnInit } from '@angular/core';
import * as dateFns from 'date-fns';
import { fr } from 'date-fns/locale';
import { EmployeeService } from '../../_services/employees/employee.service';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SaveDatesRequest } from './SaveDatesRequest';
import { LocalStorageService } from '../../_services/local-storage/local-storage.service';
import { UserService } from  '../../_services/loginService/user.service';
import { SprintService} from '../../_services/sprint/sprint.service';
import { Sprint} from '../../_services/sprint/sprint.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TeamService } from '../../_services/teams/team.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import * as ExcelJS from 'exceljs';



interface DayData {
  [day: string]: string;
}

interface WeekData {
  [week: string]: DayData;
}

interface MonthData {
  [month: string]: WeekData;
}

interface Row {
  employeeId:number
  label: string;
  email: string;
  data: MonthData;
  selectedDates?: Date[]; // Assurez-vous que le type est Date[]
}
interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  linkedin: string;
  // Add any other fields that are part of the employee object
}

interface LeaveRequest {
  id: number;
  employee: Employee; // Nested employee object
  selectedDates: Date[];
  confirmed: boolean;
}
interface SprintGroup {
  startDay: number;
  sprintName: string;
  colspan: number;
}

@Component({
  selector: 'app-conge-table',
  standalone: true,
  imports: [CommonModule,    RouterModule
  ],
  templateUrl: './conge-table.component.html',
  styleUrls: ['./conge-table.component.scss']
})
export class CongeTableComponent implements OnInit {
  
  sprints: Sprint[] = [];
  team: any;
  i:number=0 ;
  confirmedDates: { employeeId: number, date: string }[] = [];
  unconfirmedDates: { employeeId: number, date: string }[] = [];
  employeeId: number = 0;
  userId: number | undefined;
  connectedUsername:string=';'
  selectedDates: Date[] = [];
  months: any[] = [];
  months2: any[] = [];

  rows: Row[] = [];
  selectedDays: Set<string> = new Set();
  hoveredDay: { row: string, month: string, week: string, day: string } | null = null;
  connectedEmployeeEmail: string = '';
  isAdmin: boolean = false;
  leaveRequests: LeaveRequest[] = [];
  employeeMap: { [email: string]: string } = {}; // Mapping of emails to names
  confirmedDays: Set<string> = new Set();
  showNotification: boolean = false;
  notificationMessage: string = '';
  currentMonth: string = ''; // Nouvelle propriété pour le mois actuel

  
  constructor(  private router: Router,  
       private route: ActivatedRoute,

    private teamService: TeamService,

    private sprintService:SprintService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
  // Méthode à implémenter
    private localStorageService: LocalStorageService ,// Inject the new service
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const locale = fr;
    
    this.months = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(currentYear, i, 1);
      const monthName = dateFns.format(monthDate, 'MMMM', { locale });
      const year = dateFns.format(monthDate, 'yyyy');

      const weeksArray = this.generateWeeks(monthDate);
      const daysInMonth = dateFns.getDaysInMonth(monthDate);

      return {
        name: monthName,
        year: year,
        weeks: weeksArray,
        days: daysInMonth
      };
    });


    this.months2 = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(currentYear, i, 1);
      const monthName = dateFns.format(monthDate, 'MMMM', { locale });
      const year = dateFns.format(monthDate, 'yyyy');

      const weeksArray = this.generateWeeks(monthDate);
      const daysInMonth = dateFns.getDaysInMonth(monthDate);

      return {
        name: monthName,
        year: year,
        weeks: weeksArray,
        days: daysInMonth
      };
    });

    
  }




  
  ngOnInit(): void {
    this.loadLeaveRequests();

       this.route.paramMap.subscribe((param) => {
      const teamId = String(param.get('teamId'));
      this.getTeamData(teamId); // Ajoutez cette ligne
      if (teamId) {
        this.sprintService.getSprintsByTeamId(+teamId).subscribe({
          next: (data) => {
            this.sprints = data.map((sprint) => ({
              ...sprint,
              color: this.generateRandomTransparentColor(),
            }));
            console.error(this.sprints);
          },
          error: (err) => {
            console.error('Error fetching sprints', err);
          },
        });;
        
      } else {
        console.error('No teamId found in the route');
      }

      this.loadEmployeeData(teamId);

    });
    this.initializeUserDetails();
    this.isAdmin = this.tokenStorage.getUser().roles.includes('ROLE_ADMIN');
    if (this.isAdmin) {
      this.loadLeaveRequests();
    }
    this.loadSelectedDates();
    this.loadConfirmedDays();
    this.loadAllDatesFromLocalStorage();

    
    const now = new Date();
    this.currentMonth = dateFns.format(now, 'MMMM', { locale: fr });
    this.fetchLeaveRequests();
    this.employeeService.getAllLeaveRequests().subscribe(data => {
      this.leaveRequests = data;
    });
    this.fetchSelectedDatesForEmployee();
  }

  generateRandomTransparentColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.5; // transparency level, you can adjust this
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  
  // Helper method to format the date
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  


  getDayColor(day: number, month: any, year: number, employeeId: number): string {
    // Map French month names to their index
    const monthIndexMap: { [key: string]: number } = {
      'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4,
      'juin': 5, 'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9,
      'novembre': 10, 'décembre': 11
    };
  
    // Get the month index from month.name
    const monthIndex = monthIndexMap[month.name.toLowerCase()];
    if (monthIndex === undefined) {
      console.error(`Invalid month name: ${month.name}`);
      return 'light'; // Default color if month is invalid
    }
  
    // Validate day and year
    const dayNumber = Number(day);
    const yearNumber = Number(year);
    if (isNaN(dayNumber) || isNaN(yearNumber) || dayNumber < 1 || dayNumber > 31) {
      console.error(`Invalid values - Day: ${dayNumber}, Year: ${yearNumber}`);
      return 'light'; // Default color if day or year is invalid
    }
  
    // Create date object
    const date = new Date(yearNumber, monthIndex, dayNumber).toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
    // Check if date is confirmed or selected
    const isConfirmed = this.confirmedDates.some(cd => {
      const confirmedDate = new Date(cd.date).toISOString().split('T')[0];
      return cd.employeeId === employeeId && confirmedDate === date;
    });
  
   const isSelected = this.unconfirmedDates.some(uc => {
      const unconfirmedDate = new Date(uc.date).toISOString().split('T')[0];
      return uc.employeeId === employeeId && unconfirmedDate === date;
    });
  
  
  
    if (isConfirmed) {
    
      return 'green'; // Color for confirmed dates
    } else if (isSelected) {
      console.log(date ,"yellow")
      return 'yellow'; // Color for selected dates
    }
  
    // Check if date falls within any sprint range
    for (const sprint of this.sprints) {
      const sprintStart = new Date(sprint.date_Debut).toISOString().split('T')[0];
      const sprintEnd = new Date(sprint.date_Fin).toISOString().split('T')[0];
    
      if (date >= sprintStart && date <= sprintEnd) {
        return sprint.color || 'lightblue'; // Default color if none is set
      }
    }
  
    return 'light'; // No color if the day does not belong to any sprint
  }
  
  
  getSprintName(day: number, month: any, year: number): string {
    const monthIndexMap: { [key: string]: number } = {
      'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4,
      'juin': 5, 'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9,
      'novembre': 10, 'décembre': 11
    };
  
    const monthIndex = monthIndexMap[month.name.toLowerCase()];
    if (monthIndex === undefined) {
      return ''; // Return empty if month is invalid
    }
  
    const dayNumber = Number(day);
    const yearNumber = Number(year);
    if (isNaN(dayNumber) || isNaN(yearNumber) || dayNumber < 1 || dayNumber > 31) {
      return ''; // Return empty if day or year is invalid
    }
  
    const date = new Date(yearNumber, monthIndex, dayNumber);
  
    for (const sprint of this.sprints) {
      const sprintStart = new Date(sprint.date_Debut);
      const sprintEnd = new Date(sprint.date_Fin);
  
      if (date >= sprintStart && date <= sprintEnd) {
        return sprint.name || ''; // Return the sprint name if it matches
      }
    }
  
    return ''; // Return empty if the day does not belong to any sprint
  }

  
  
  
  
  
  initializeUserDetails(): void {
    const user = this.tokenStorage.getUser();
    if (user) {
      this.connectedEmployeeEmail = user.email;
      this.userId = user.id;
      this.connectedUsername=user.username;
      if (this.userId !== undefined) {
        this.employeeService.getEmployeeIdByUserId(this.userId).subscribe({
          next: (id: number) => this.employeeId = id,
          
          error: (err: any) => console.error('Error fetching employee ID', err)
        });

      } else {
        console.error('User ID is undefined');
      }
    } else {
      console.error('User not found in token storage');
    }
  }

  getDayColor2(day: number, month: any, year: number): string {
    // Map French month names to their index
    const monthIndexMap: { [key: string]: number } = {
      'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4,
      'juin': 5, 'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9,
      'novembre': 10, 'décembre': 11
    };
  
    // Get the month index from month.name
    const monthIndex = monthIndexMap[month.name.toLowerCase()];
    if (monthIndex === undefined) {
      console.error(`Invalid month name: ${month.name}`);
      return 'blue'; // Default color if month is invalid
    }
  
    // Validate day and year
    const dayNumber = Number(day);
    const yearNumber = Number(year);
    if (isNaN(dayNumber) || isNaN(yearNumber) || dayNumber < 1 || dayNumber > 31) {
      console.error(`Invalid values - Day: ${dayNumber}, Year: ${yearNumber}`);
      return 'blue'; // Default color if day or year is invalid
    }
  
    // Create date object
    const date = new Date(yearNumber, monthIndex, dayNumber);
  
    // Check if date falls within any sprint range
    for (const sprint of this.sprints) {
      const sprintStart = new Date(sprint.date_Debut);
      const sprintEnd = new Date(sprint.date_Fin);
  
      if (date >= sprintStart && date <= sprintEnd) {
        return sprint.color || 'lightblue'; // Default color if none is set
      }
    }
  
    return 'light'; // No color if the day does not belong to any sprint
  }
  isFirstDayOfSprint(day: number, week: number[], month: any, year: number): boolean {
    // Obtenez le nom du sprint pour le jour actuel
    const sprintName = this.getSprintName(day, month, year);
  
    // Vérifiez si c'est le premier jour du sprint dans la semaine
    const previousDay = week[week.indexOf(day) - 1];
    const previousSprintName = previousDay ? this.getSprintName(previousDay, month, year) : '';
  
    return sprintName !== previousSprintName;
  }
  
  groupDaysBySprint(week: number[], month: any, year: number): SprintGroup[] {
    const groups: SprintGroup[] = [];
    let currentGroup: SprintGroup | null = null;

    week.forEach((day, index) => {
      const sprintName = this.getSprintName(day, month, year);

      if (currentGroup && currentGroup.sprintName === sprintName) {
        currentGroup.colspan++;
      } else {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { startDay: day, sprintName, colspan: 1 };
      }

      if (index === week.length - 1 && currentGroup) {
        groups.push(currentGroup);
      }
    });

    return groups;
  }


  // Exemple de méthode pour obtenir le nom du sprint
 
  saveDatesToDatabase(): void {
    const request: SaveDatesRequest = {
      employeeId: this.employeeId,
      dates: this.selectedDates,
      name: this.connectedUsername // Ensure this variable is set earlier in your code
    };
  
    this.employeeService.saveSelectedDates(request).subscribe(
      response => {
        console.log('Dates saved to database:', response);
      },
      error => {
        console.error('Error saving dates to database:', error);
      }
    );
  }
  
loadEmployeeData(teamId:string): void {
  this.employeeService.getByTeam(teamId).subscribe((employees: any[]) => {
    this.rows = employees.map(employee => ({
      label: `${employee.firstname} ${employee.lastname}`,
      email: employee.email,
      employeeId: employee.id,
      data: this.generateEmployeeData()
    }));
    this.employeeMap = employees.reduce((map, employee) => {
      map[employee.email] = `${employee.firstname} ${employee.lastname}`;
      return map;
    }, {});
  });
}


  getEmployeeName(email: string): string {
    return this.employeeMap[email] || 'Unknown Employee';
  }
  loadLeaveRequests(): void {
    this.employeeService.getAllLeaveRequests().subscribe((data: LeaveRequest[]) => {
      this.leaveRequests = data;
      
      // Afficher leaveRequests dans la console
      console.log('Leave Requests:', this.leaveRequests);

      // Séparer les dates confirmées et non confirmées
      this.processLeaveRequests(data);
    });
  }

  processLeaveRequests(data: LeaveRequest[]): void {
    this.confirmedDates = [];
    this.unconfirmedDates = [];

    data.forEach(request => {
      const employeeId = request.employee.id;
      
      request.selectedDates.forEach(dateString => {
        // Convertir la chaîne de caractères en objet Date
        const date = new Date(dateString);
        
        // Convertir l'objet Date en chaîne de caractères au format souhaité
        const formattedDate = date.toISOString(); // ou date.toLocaleDateString()

        if (request.confirmed) {
          this.confirmedDates.push({ employeeId, date: formattedDate });
        } else {
          this.unconfirmedDates.push({ employeeId, date: formattedDate });
        }
      });
    });

    // Afficher les dates confirmées et non confirmées dans la console
    console.log('Confirmed Dates:', this.confirmedDates);
    console.log('Unconfirmed Dates:', this.unconfirmedDates);
  }
  updateRowsWithLeaveRequests(leaveRequests: LeaveRequest[]): void {
    leaveRequests.forEach(request => {
      const row = this.rows.find(r => r.email === request.employee.email);
      if (row) {
        this.processLeaveRequestForRow(request, row);
      }
    });
  }

  private processLeaveRequestForRow(request: LeaveRequest, row: Row): void {
    request.selectedDates.forEach(date => {
      const monthName = dateFns.format(date, 'MMMM', { locale: fr });
      const day = dateFns.format(date, 'd', { locale: fr });
      const weekIndex = this.getWeekIndex(date, monthName);
      
      if (row.data[monthName] && row.data[monthName][`Week ${weekIndex + 1}`]) {
        row.data[monthName][`Week ${weekIndex + 1}`][day] = request.confirmed ? 'C' : 'P';
        
        if (!request.confirmed) {
          this.selectedDays.add(`${row.label}-${monthName}-${this.getWeekName(weekIndex)}-${day}`);
        }
      }
    });
  }

  
  isDaySelected(label: string, month: string, weekIndex: number, day: string): boolean {
    const key = `${label}-${month}-${this.getWeekName(weekIndex)}-${day}`;
    return this.selectedDays.has(key);
  }
  generateEmployeeData(): MonthData {
    const defaultData: DayData = {};
    return this.months.reduce((acc: MonthData, month) => {
      acc[month.name] = month.weeks.reduce((weekAcc: WeekData, week: string[], weekIndex: number) => {
        weekAcc[`Week ${weekIndex + 1}`] = week.reduce((dayAcc: DayData, day: string) => {
          const dateStr = `${month.year}-${String(this.months.indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
          const date = new Date(dateStr);
          const dayOfWeek = dateFns.getDay(date);
          dayAcc[day] = this.getDayStatus(dayOfWeek);
          if (this.isDaySelected(month.name, this.getWeekName(weekIndex), weekIndex, day)) {
            dayAcc[day] = 'S';
          }
          return dayAcc;
        }, {});
        return weekAcc;
      }, {});
      return acc;
    }, {});
  }
  getDayStatus(dayOfWeek: number): string {
    return (dayOfWeek === 6 || dayOfWeek === 0) ? 'WE' : '1';
  }
  generateWeeks(date: Date): string[][] {
    const weeks: string[][] = [];
    let currentWeek: string[] = [];
    let currentDate = dateFns.startOfMonth(date);
    const endDate = dateFns.endOfMonth(date);
  
    while (currentDate <= endDate) {
      currentWeek.push(dateFns.format(currentDate, 'd', { locale: fr }));
      if (dateFns.getDay(currentDate) === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate = dateFns.addDays(currentDate, 1);
    }
  
    if (currentWeek.length) {
      weeks.push(currentWeek);
    }
  
    return weeks;
  }

  getWeekIndex(date: Date, monthName: string): number {
    const month = this.months.find(m => m.name === monthName);
    if (month) {
      return month.weeks.findIndex((week: string[]) =>
        week.includes(dateFns.format(date, 'd', { locale: fr }))
      );
    }
    return -1;
  }

  getWeekName(index: number): string {
    return `Week ${index + 1}`;
  }

  getOverallWeekNumber(month: any, weekIndex: number): number {
    let overallWeekNumber = weekIndex + 1;
  
    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i] === month) {
        break;
      }
      overallWeekNumber += this.months[i].weeks.length;
    }
  
    return overallWeekNumber;
  }
  
  toggleDaySelection(label: string, month: any, weekIndex: number, day: string): void {
    const row = this.rows.find(r => r.label === label);
    const key = `${label}-${month.name}-${this.getWeekName(weekIndex)}-${day}`;
   // if ((row && row.email === this.connectedEmployeeEmail) || this.isAdmin) {

    if ((row && row.email === this.connectedEmployeeEmail) ) {
      const date = new Date(`${month.year}-${this.months.indexOf(month) + 1}-${day}`);
      const formattedDate = dateFns.format(date, 'yyyy-MM-dd');
      
      // Check if the day is a weekend or marked as a weekend (WE)
      if (this.isWeekend(formattedDate) || (row?.data[month.name]?.[this.getWeekName(weekIndex)]?.[day] === 'WE')) {
        return; // Skip weekends
      }
    
      // Toggle the selected day
      if (this.selectedDays.has(key)) {
        this.selectedDays.delete(key);
      } else {
        this.selectedDays.add(key);
      }
    }
  }
  
  
  
  
showNotificationMessage(message: string): void {
  this.notificationMessage = message;
  this.showNotification = true;
  setTimeout(() => {
    this.showNotification = false;
    this.notificationMessage = '';
  }, 3000);
}
isSelectedDay(label: string, month: any, weekIndex: number, day: string): boolean {
  const key = `${label}-${month.name}-${this.getWeekName(weekIndex)}-${day}`;
 
  // Check if the day is selected in the current session
  if (this.selectedDays.has(key)) {
    console.log(key);
    console.log(weekIndex)
    return true;
  }
  // Check if the day is part of any leave request from the database
  for (const request of this.leaveRequests) {
    if (`${request.employee.firstname} ${request.employee.lastname}` === label) {
      const formattedDate = new Date(`${month.year}-${month.name}-${day}`);
      if (request.selectedDates.some(selectedDate => new Date(selectedDate).getTime() === formattedDate.getTime())) {
        return true;
      }
    }
  }
  return false;
}

isConfirmedDay(day: number, month: any, year: number, employeeId: number): boolean {
  // Map French month names to their index
  const monthIndexMap: { [key: string]: number } = {
    'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4,
    'juin': 5, 'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9,
    'novembre': 10, 'décembre': 11
  };

  // Get the month index from month.name
  const monthIndex = monthIndexMap[month.name.toLowerCase()];
  if (monthIndex === undefined) {
    console.error(`Invalid month name: ${month.name}`);
    return false;
  }

  // Validate day and year
  const dayNumber = Number(day);
  const yearNumber = Number(year);
  if (isNaN(dayNumber) || isNaN(yearNumber) || dayNumber < 1 || dayNumber > 31) {
    console.error(`Invalid values - Day: ${dayNumber}, Year: ${yearNumber}`);
    return false;
  }

  // Create date object in YYYY-MM-DD format
  const date = new Date(yearNumber, monthIndex, dayNumber).toISOString().split('T')[0];

  // Normalize date format in confirmedDates
  const isConfirmed = this.confirmedDates.some(cd => {
    const confirmedDate = new Date(cd.date).toISOString().split('T')[0];
    return cd.employeeId === employeeId && confirmedDate === date;
  });

  return isConfirmed;
}


  isHovered(label: string, month: any, weekIndex: number, day: string): boolean {
    if (!this.hoveredDay) return false;
    return this.hoveredDay.row === label &&
           this.hoveredDay.month === month.name &&
           this.hoveredDay.week === this.getWeekName(weekIndex) &&
           this.hoveredDay.day === day;
  }

  isWeekend(day: string): boolean {
    return day === 'WE'; // Assuming 'WE' represents weekends
  }
  
  
  messageSuccess: string | null = null;

  confirmLeaveRequest(): void {
    const request: SaveDatesRequest = {
      employeeId: this.employeeId,
      dates: this.getSelectedDates(),
      name: this.connectedUsername
    };
  
    this.employeeService.saveSelectedDates(request).subscribe(
      response => {
        console.log('Leave request confirmed:', response);
        this.messageSuccess = 'Congé envoyé avec succès!';
  
        this.saveSelectedDates(); 
        this.updateConfirmedDays(); 
        this.showSuccessNotification('Dates saved successfully!');
  
        setTimeout(() => {
          this.messageSuccess = null;
          // Rafraîchir la page après 10 secondes
        }, 10000);
      },
      error => {
        console.error('Error saving dates:', error);
      }
    );
  }
  
  showSuccessNotification(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
  }
  closeNotification(): void {
    this.showNotification = false;
  }

  getSelectedDates(): Date[] {
    const dates: Date[] = [];
    this.selectedDays.forEach((key: string) => {
      const [label, monthName, weekName, day] = key.split('-');
      const month = this.months.find(m => m.name === monthName);
      if (month) {
        const year = month.year;
        const date = new Date(`${year}-${String(this.months.indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`);
        dates.push(date);
      }
    });
    return dates;
  }
  
  updateConfirmedDays(): void {
    this.selectedDays.forEach(day => this.confirmedDays.add(day));
    this.selectedDays.clear();
    this.saveConfirmedDays();
    this.updateConfirmedDates(); // Mettre à jour l'affichage des jours confirmés
  }  
  acceptLeaveRequest(requestId: number): void {
    const request = this.leaveRequests.find(r => r.id === requestId);
    
    if (request) {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorage.getToken()
      });
  
      this.http.put(`http://localhost:8080/api/leaves/${requestId}/confirm`, {}, { headers })
        .subscribe(() => {
          request.confirmed = true;
          this.updateRowsWithLeaveRequests([request]);
          console.log('Leave request accepted:', request);
        });
    }
  }
  saveSelectedDates(): void {
    const employeeId = this.tokenStorage.getUser().id;
    const selectedDates = Array.from(this.selectedDays).map(dateStr => {
      const [label, monthName, weekName, day] = dateStr.split('-');
      const month = this.months.find(m => m.name === monthName);
      if (month) {
        const dateStr = `${month.year}-${String(this.months.indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
        return new Date(dateStr).toISOString(); // Format dates as ISO string
      }
      return '';
    }).filter(dateStr => dateStr !== '');
    
    this.localStorageService.setItem('selectedDates', JSON.stringify(selectedDates));
    
  }
  
  isDateSelected(day: string, monthName: string, week: string): boolean {
    const key = `${this.connectedEmployeeEmail}-${monthName}-${week}-${day}`;
    return this.selectedDays.has(key);
  }
  // calendar.component.ts
getDaysInMonth(month: { name: string, year: number }): Date[] {
  const days: Date[] = [];
  const monthIndex = this.months.indexOf(month);
  const date = new Date(month.year, monthIndex, 1);
  while (date.getMonth() === monthIndex) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
getDayClass(row: Row, month: any, week: string[], day: string): string {
  const key = `${row.label}-${month.name}-${week}-${day}`;

  if (this.selectedDays.has(key)) {
    return 'highlight-yellow'; // Appliquer la classe si la date est sélectionnée
  }

  const date = new Date(`${month.year}-${String(this.months.find(m => m.name === month.name).days.indexOf(day) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`);
  const isConfirmed = this.leaveRequests.some(request =>
    request.selectedDates.some(selectedDate =>
      new Date(selectedDate).toDateString() === date.toDateString() && request.confirmed === false
    )
  );

  if (isConfirmed) {
    return 'highlight-yellow'; // Appliquer la classe si la date est confirmée comme fausse
  }

  return '';
}



isHighlightedDate(label: string, month: any, weekIndex: number, day: string): boolean {
  const dateString = `${month.name}-${this.getWeekName(weekIndex)}-${day}`;
  return this.selectedDays.has(`${label}-${dateString}`);
}

loadSelectedDates(): void {
  const storedDates = this.localStorageService.getItem('selectedDates');
  if (storedDates) {
    const dates: string[] = JSON.parse(storedDates);
    dates.forEach(dateStr => {
      this.selectedDates = dates.map(dateStr => new Date(dateStr)); // Convertir les chaînes en objets Date
      this.updateSelectedDays(); 
      const date = new Date(dateStr);
      const monthName = dateFns.format(date, 'MMMM', { locale: fr });
      const day = dateFns.format(date, 'd', { locale: fr });
      const weekIndex = this.getWeekIndex(date, monthName);
      const row = this.rows.find(r => r.email === this.connectedEmployeeEmail);
      if (row) {
        if (row.data[monthName] && row.data[monthName][`Week ${weekIndex + 1}`]) {
          row.data[monthName][`Week ${weekIndex + 1}`][day] = '0'; // Mark selected days
          this.selectedDays.add(`${row.label}-${monthName}-${this.getWeekName(weekIndex)}-${day}`);
        }
      }
    });
  }

}

updateSelectedDays(): void {
  this.selectedDays.clear();
  this.selectedDates.forEach(date => {
    const monthName = dateFns.format(date, 'MMMM', { locale: fr });
    const day = dateFns.format(date, 'd', { locale: fr });
    const weekIndex = this.getWeekIndex(date, monthName);
    const key = `${this.connectedEmployeeEmail}-${monthName}-${this.getWeekName(weekIndex)}-${day}`;
    this.selectedDays.add(key); // Mettre à jour les jours sélectionnés dans l'UI
    
    // Log the date with yellow color in the console
    console.log('%cSelected Date:', 'color: yellow; font-weight: bold;', key);
  });
}


updateUIWithSelectedDates(): void {
  this.selectedDates.forEach(date => {
    const monthName = dateFns.format(date, 'MMMM', { locale: fr });
    const day = dateFns.format(date, 'd', { locale: fr });
    const weekIndex = this.getWeekIndex(date, monthName);
    const key = `${this.connectedEmployeeEmail}-${monthName}-${this.getWeekName(weekIndex)}-${day}`;
    this.selectedDays.add(key); // Mettre à jour les jours sélectionnés dans l'UI
  });
}



loadConfirmedDays(): void {
  this.confirmedDays = this.localStorageService.loadConfirmedDays();
  console.log(this.confirmedDays);
  this.updateConfirmedDates(); // Update the calendar with confirmed dates
  this.leaveRequests.forEach(request => {
    if (request.confirmed) {
      request.selectedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        const monthName = dateFns.format(date, 'MMMM', { locale: fr });
        const day = dateFns.format(date, 'd', { locale: fr });
        const weekIndex = this.getWeekIndex(date, monthName);
        const row = this.rows.find(r => r.email === request.employee.email);
        if (row && row.data[monthName] && row.data[monthName][`Week ${weekIndex + 1}`]) {
          row.data[monthName][`Week ${weekIndex + 1}`][day] = 'C';
          this.confirmedDays.add(`${row.label}-${monthName}-${this.getWeekName(weekIndex)}-${day}`);

        }
      });
    }
  });
  console.log(this.confirmedDays);

}
fetchLeaveRequests() {
  this.employeeService.getAllLeaveRequests().subscribe(
    data => {
      this.leaveRequests = data;
    },
    error => {
      console.error('Error fetching leave requests', error);
    }
  );
}
updateConfirmedDates(): void {
  this.rows.forEach(row => {
    Object.keys(row.data).forEach(monthName => {
      const monthData = row.data[monthName];
      Object.keys(monthData).forEach(weekName => {
        const weekData = monthData[weekName];
        Object.keys(weekData).forEach(day => {
          const key = `${row.label}-${monthName}-${weekName}-${day}`;
          if (this.confirmedDays.has(key)) {
            weekData[day] = '0'; // Update confirmed days to a different color
          }
        });
      });
    });
  });
  console.log( this.rows)
}


saveConfirmedDays(): void {
  this.localStorageService.saveConfirmedDays(this.confirmedDays);
}
 getEmployeeSpecificDates(email: string): Date[] {
    const employee = this.leaveRequests.find(request => request.employee.email === email);
    return employee ? employee.selectedDates.map(dateStr => new Date(dateStr)) : [];
  }
  fetchSelectedDatesForEmployee(): void {
    this.employeeService.getSelectedDatesForEmployee(this.employeeId)
      .subscribe({
        next: (dates: string[]) => {
          console.log('Selected dates:', dates);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }
  fetchEmployeeDetails(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employeeId = employee.id;
        this.fetchSelectedDatesForEmployee();
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
      }
    });
  }
  loadAllDatesFromLocalStorage(): void {
    const storedDates = this.localStorageService.loadSelectedDates();
    this.selectedDates = Array.from(storedDates).map(dateString => new Date(dateString));
    console.log('Dates sélectionnées chargées du stockage local:', this.selectedDates);
  }
  
  confirmRequest(requestId: number): void {
    this.employeeService.confirmLeave(requestId).subscribe(
      response => {
        console.log('Leave request confirmed:', response);
        this.showNotificationMessage('Leave request confirmed successfully!');
        this.loadLeaveRequests(); // Recharger les demandes de congé pour afficher les mises à jour
      },
      error => {
        console.error('Error confirming leave request:', error);
      }
    );
  }
  
  rejectRequest(requestId: number): void {
    this.employeeService.rejectLeave(requestId).subscribe(
      response => {
        console.log('Leave request rejected:', response);
        this.showNotificationMessage('Leave request rejected successfully!');
        this.loadLeaveRequests(); // Recharger les demandes de congé pour afficher les mises à jour
      },
      error => {
        console.error('Error rejecting leave request:', error);
      }
    );
  }
  getTeamData(teamId:string) {
    var y: number = +teamId;

    this.teamService.getTeamById(y).subscribe(data => {
      this.team = data; // Assurez-vous que la propriété 'team' est définie dans votre composant
    });
  }
  
}


