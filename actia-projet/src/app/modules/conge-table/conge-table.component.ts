import { Component, OnInit } from '@angular/core';
import * as dateFns from 'date-fns';
import { fr } from 'date-fns/locale';
import { EmployeeService } from '../../_services/employees/employee.service';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
      this.loadLeaveRequests(); // Chargement des demandes de congés
    }
    this.loadSelectedDates();
    this.loadConfirmedDays();
  }
  
  loadEmployeeData(): void {
    this.employeeService.getAllEmployees().subscribe((employees: any[]) => {
      this.rows = employees.map(employee => ({
        label: `${employee.firstname} ${employee.lastname}`,
        email: employee.email,
        data: this.generateEmployeeData()
      }));

      // Build the employee map for quick lookup
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
      this.updateRowsWithLeaveRequests(data);
    });
  }

  updateRowsWithLeaveRequests(leaveRequests: LeaveRequest[]): void {
    leaveRequests.forEach(request => {
      const row = this.rows.find(r => r.email === request.employeeEmail);
      if (row) {
        row.selectedDates = request.selectedDates; // Type corrigé ici
        request.selectedDates.forEach((date: Date) => { // Type corrigé ici
          const monthName = dateFns.format(date, 'MMMM', { locale: fr });
          const day = dateFns.format(date, 'd', { locale: fr });
          const weekIndex = this.getWeekIndex(date, monthName);
          if (row.data[monthName] && row.data[monthName][`Week ${weekIndex + 1}`]) {
            row.data[monthName][`Week ${weekIndex + 1}`][day] = 'L'; // Marquer les jours de congé
            this.selectedDays.add(`${row.label}-${monthName}-${this.getWeekName(weekIndex)}-${day}`);
          }
        });
      }
    });
  }
  generateEmployeeData(): MonthData {
    const defaultData: DayData = {};
    return this.months.reduce((acc: MonthData, month) => {
      acc[month.name] = month.weeks.reduce((weekAcc: WeekData, week: string[], weekIndex: number) => {
        weekAcc[`Week ${weekIndex + 1}`] = week.reduce((dayAcc: DayData, day: string) => {
          const dateStr = `${month.year}-${String(this.months.indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
          const date = new Date(dateStr);
          const dayOfWeek = dateFns.getDay(date);
          dayAcc[day] = (dayOfWeek === 6 || dayOfWeek === 0) ? 'WE' : '1';
          return dayAcc;
        }, {});
        return weekAcc;
      }, {});
      return acc;
    }, {});
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
  toggleDaySelection(label: string, month: { name: string; year: number; weeks: string[][]; days: number }, weekIndex: number, day: string): void {
    if (!this.isAdmin) {
      const row = this.rows.find(r => r.label === label);
      if (row && row.email === this.connectedEmployeeEmail) {
        const key = `${label}-${month.name}-${this.getWeekName(weekIndex)}-${day}`;
        const dayData = row.data[month.name][this.getWeekName(weekIndex)][day];
  
        if (this.isWeekend(day) || dayData === 'WE') {
          return;
        }
        if (this.selectedDays.has(key)) {
          this.selectedDays.delete(key);
          row.data[month.name][this.getWeekName(weekIndex)][day] = this.isConfirmedDay(label, month, weekIndex, day) ? '0' : '0';
        } else {
          this.selectedDays.add(key);
          row.data[month.name][this.getWeekName(weekIndex)][day] = '0';
        }
        this.saveSelectedDates(); // Save selected dates to local storage
      }
    }
  }
  

  isSelectedDay(label: string, month: any, weekIndex: number, day: string): boolean {
    const key = `${label}-${month.name}-${this.getWeekName(weekIndex)}-${day}`;
    return this.selectedDays.has(key);
  }
  isConfirmedDay(label: string, month: any, weekIndex: number, day: string): boolean {
    return this.confirmedDays.has(`${label}-${month.name}-${this.getWeekName(weekIndex)}-${day}`);
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
    const user = this.tokenStorage.getUser(); // Récupérer les données de l'utilisateur
    if (!user) {
      console.error('Utilisateur non connecté');
      return;
    }
  
    const leaveRequest: LeaveRequest = {
      id: 0, // Auto-incrémenter ou générer cet ID dans le backend
      employeeId: user.id,
      employeeEmail: user.email, // Assurez-vous que l'email est bien récupéré
      employeeName: `${user.firstname} ${user.lastname}`, // Assurez-vous que le nom est bien formaté
      selectedDates: this.getSelectedDates(), // Les dates sélectionnées par l'utilisateur
      confirmed: false // Initialement non confirmé, peut être mis à jour plus tard
    };
  
    // Log des données pour le débogage
    console.log('Demande de congé:', leaveRequest);
  
    this.employeeService.requestLeave(leaveRequest).subscribe(
      response => {
        console.log('Demande de congé confirmée:', response);
        this.messageSuccess = 'Congé envoyé avec succès!';
        this.saveSelectedDates();
        this.showSuccessNotification('Congé envoyé avec succès !');
        setTimeout(() => {
          this.messageSuccess = null;
        }, 3000);
      },
      error => {
        console.error('Erreur lors de l\'envoi de la demande de congé:', error);
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
    this.selectedDays.forEach(key => {
      const [label, monthName, weekName, day] = key.split('-');
      const month = this.months.find(m => m.name === monthName);
      if (month) {
        const year = month.year;
        const date = new Date(`${year}-${String(this.months.indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`);
        dates.push(date);
      }
    });
    console.log("dates", dates);
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
    const selectedDates = this.getSelectedDates();
    this.tokenStorage.setItem('selectedDates', JSON.stringify(selectedDates));
}
  isDateSelected(date: Date): boolean {
    const selectedDates = this.getSelectedDates();
    return selectedDates.some(d => d.getTime() === date.getTime());
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

loadSelectedDates(): void {
  const storedDates = this.tokenStorage.getItem('selectedDates');
  if (storedDates) {
    const dates: Date[] = JSON.parse(storedDates); // Assurez-vous que le type est Date[]
    dates.forEach((date: Date) => { // Type corrigé ici
      const monthName = dateFns.format(date, 'MMMM', { locale: fr });
      const day = dateFns.format(date, 'd', { locale: fr });
      const weekIndex = this.getWeekIndex(date, monthName);
      const row = this.rows.find(r => r.email === this.connectedEmployeeEmail);
      if (row) {
        if (row.data[monthName] && row.data[monthName][`Week ${weekIndex + 1}`]) {
          row.data[monthName][`Week ${weekIndex + 1}`][day] = '0'; // Marquer les jours sélectionnés
          this.selectedDays.add(`${row.label}-${monthName}-${this.getWeekName(weekIndex)}-${day}`);
        }
      }
    });
  }
}
  loadConfirmedDays(): void {
    this.confirmedDays = this.tokenStorage.loadConfirmedDays();
    this.updateConfirmedDates(); // Update the calendar with confirmed dates
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
  }
  
  saveConfirmedDays(): void {
    this.tokenStorage.saveConfirmedDays(this.confirmedDays);
  }
  
  
  
}