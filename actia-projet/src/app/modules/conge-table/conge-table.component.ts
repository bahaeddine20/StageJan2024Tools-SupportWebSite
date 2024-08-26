import { Component, OnInit } from '@angular/core';
import * as dateFns from 'date-fns';
import { fr } from 'date-fns/locale';
import { EmployeeService } from '../../_services/employees/employee.service';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SaveDatesRequest } from './SaveDatesRequest';


//import { NotificationBarComponent } from '../notification-bar.component';
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
  label: string;
  email: string;
  data: MonthData;
  selectedDates?: Date[]; // Assurez-vous que le type est Date[]
}


interface LeaveRequest {
  id: number;
  employeeEmail: string;
  employeeId: number;
  employeeName: string;
  selectedDates: Date[];
  confirmed: boolean;
}

@Component({
  selector: 'app-conge-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conge-table.component.html',
  styleUrls: ['./conge-table.component.scss']
})
export class CongeTableComponent implements OnInit {
  employeeId: number = 19;
  selectedDates: Date[] = [];
  months: any[] = [];
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
  constructor(
    private employeeService: EmployeeService,
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
  ) {
    const currentYear = new Date().getFullYear();
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
  }
  
ngOnInit(): void {
  this.connectedEmployeeEmail = this.tokenStorage.getUser().email;
  this.isAdmin = this.tokenStorage.getUser().roles.includes('ROLE_ADMIN');
  this.loadEmployeeData();
  if (this.isAdmin) {
    this.loadLeaveRequests();
  }
  this.loadSelectedDates();
  this.loadConfirmedDays();

  // Définir le mois actuel
  const now = new Date();
  this.currentMonth = dateFns.format(now, 'MMMM', { locale: fr });
  this.fetchLeaveRequests();
  this.employeeService.getAllLeaveRequests().subscribe(data => {
    this.leaveRequests = data;
  });
  this.fetchSelectedDatesForEmployee();
}

loadEmployeeData(): void {
  this.employeeService.getAllEmployees().subscribe((employees: any[]) => {
    this.rows = employees.map(employee => ({
      label: `${employee.firstname} ${employee.lastname}`,
      email: employee.email,
      data: this.generateEmployeeData()
    }));

    this.employeeMap = employees.reduce((map, employee) => {
      map[employee.email] = `${employee.firstname} ${employee.lastname}`;
      return map;
    }, {});
  });
}
loadSelectedDatesForEmployee(employeeId: number): void {
  this.employeeService.getSelectedDatesForEmployee(employeeId).subscribe(
    dates => {
      this.selectedDates = dates.map(dateStr => new Date(dateStr)); // Convert strings to Date objects
    },
    error => {
      console.error('Erreur lors de la récupération des dates:', error);
    }
  );
}
  getEmployeeName(email: string): string {
    return this.employeeMap[email] || 'Unknown Employee';
  }

loadLeaveRequests(): void {
  this.employeeService.getAllLeaveRequests().subscribe((data: LeaveRequest[]) => {
    this.leaveRequests = data;
    this.updateRowsWithLeaveRequests(data);
    this.updateConfirmedDays(); // Update confirmed days after loading
  });
}

updateRowsWithLeaveRequests(leaveRequests: LeaveRequest[]): void {
  leaveRequests.forEach(request => {
    const row = this.rows.find(r => r.email === request.employeeEmail);
    if (row) {
      this.processLeaveRequestForRow(request, row);
    }
  });
  
  // Highlight specific employee dates
  this.highlightEmployeeDates('rahma.haddar@actia-engineering.tn');
}

private processLeaveRequestForRow(request: LeaveRequest, row: Row): void {
  request.selectedDates.forEach(dateStr => {
    const date = new Date(dateStr);
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


private highlightEmployeeDates(email: string): void {
  const employeeDates = this.getEmployeeSpecificDates(email);
  employeeDates.forEach(date => {
    const monthName = dateFns.format(date, 'MMMM', { locale: fr });
    const day = dateFns.format(date, 'd', { locale: fr });
    const weekIndex = this.getWeekIndex(date, monthName);
    const key = `${email}-${monthName}-${this.getWeekName(weekIndex)}-${day}`;
    this.selectedDays.add(key); // Highlight the date in yellow
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
            dayAcc[day] = 'S'; // Highlight selected days
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
    let overallWeekNumber = 0;
    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i] === month) {
        overallWeekNumber += weekIndex + 1;
        break;
      } else {
        overallWeekNumber += this.months[i].weeks.length;
      }
    }
    return overallWeekNumber;
  }
  toggleDaySelection(label: string, month: any, weekIndex: number, day: string): void {
    const key = `${label}-${month.name}-${this.getWeekName(weekIndex)}-${day}`;
    if (this.selectedDays.has(key)) {
      this.selectedDays.delete(key);
    } else {
      this.selectedDays.add(key);
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
  return this.selectedDays.has(key);
}
isConfirmedDay(label: string, month: { name: string; year: number; weeks: string[][]; days: number }, weekIndex: number, day: string): boolean {
  const key = `${label}-${month.name}-${this.getWeekName(weekIndex)}-${day}`;
  return this.confirmedDays.has(key);
}
  isHovered(label: string, month: any, weekIndex: number, day: string): boolean {
    if (!this.hoveredDay) return false;
    return this.hoveredDay.row === label &&
           this.hoveredDay.month === month.name &&
           this.hoveredDay.week === this.getWeekName(weekIndex) &&
           this.hoveredDay.day === day;
  }

  isWeekend(day: string): boolean {
    return day === 'WE';
  }
 
  messageSuccess: string | null = null;
  confirmLeaveRequest(): void {
    const request: SaveDatesRequest = {
      employeeId: this.employeeId,
      dates: this.getSelectedDates(),
    };

    this.employeeService.saveSelectedDates(request).subscribe(
      response => {
        this.showSuccessNotification('Dates saved successfully!');
        this.updateConfirmedDays(); // Update confirmed days after saving
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
  this.employeeService.getSelectedDatesForEmployee(this.employeeId).subscribe(
    dates => {
      this.selectedDates = dates.map(dateStr => new Date(dateStr)); // Convertir les chaînes en objets Date
      this.updateSelectedDays(); // Mettre à jour les jours sélectionnés
    },
    error => {
      console.error('Erreur lors de la récupération des dates sélectionnées:', error);
    }
  );
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
  this.leaveRequests.forEach(request => {
    if (request.confirmed) {
      request.selectedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        const monthName = dateFns.format(date, 'MMMM', { locale: fr });
        const day = dateFns.format(date, 'd', { locale: fr });
        const weekIndex = this.getWeekIndex(date, monthName);
        const row = this.rows.find(r => r.email === request.employeeEmail);
        if (row && row.data[monthName] && row.data[monthName][`Week ${weekIndex + 1}`]) {
          row.data[monthName][`Week ${weekIndex + 1}`][day] = 'C';
          this.confirmedDays.add(`${row.label}-${monthName}-${this.getWeekName(weekIndex)}-${day}`);
        }
      });
    }
  });
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
            weekData[day] = 'C'; // Marquez les jours confirmés avec une couleur spécifique
          }
        });
      });
    });
  });
}

  saveConfirmedDays(): void {
    this.tokenStorage.saveConfirmedDays(this.confirmedDays);
  }
  getEmployeeSpecificDates(email: string): Date[] {
    const employee = this.leaveRequests.find(request => request.employeeEmail === email);
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
  
  
}


