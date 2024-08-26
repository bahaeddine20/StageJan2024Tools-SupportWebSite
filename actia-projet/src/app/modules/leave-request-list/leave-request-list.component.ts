import { Component, OnInit } from '@angular/core';
import { LeaveRequestService } from '../../_services/LeaveRequest/leave-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-request-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss']
})
export class LeaveRequestListComponent implements OnInit {
  leaveRequests: any[] = [];
  selectedDates: Set<string> = new Set(); // Utiliser un Set pour éviter les doublons
  months: any[] = []; // Propriété ajoutée
  rows: any[] = []; // Propriété ajoutée
  messageSuccess: string | null = null; // Propriété ajoutée
  showNotification: boolean = false; // Propriété ajoutée
  notificationMessage: string = ''; // Propriété ajoutée
  hoveredDay: any = null; // Propriété ajoutée

  constructor(private leaveRequestService: LeaveRequestService) { }

  ngOnInit(): void {
    this.loadAllLeaveRequests();
    this.loadSelectedDates(); // Charger les dates sélectionnées
    this.initializeMonths(); // Initialiser les mois (ajouté pour illustrer l'utilisation de 'months')
    this.initializeRows(); // Initialiser les lignes (ajouté pour illustrer l'utilisation de 'rows')
  }

  loadAllLeaveRequests(): void {
    this.leaveRequestService.getAllLeaveRequests().subscribe(
      data => {
        this.leaveRequests = data;
      },
      error => {
        console.error('Erreur lors de la récupération des demandes de congés', error);
      }
    );
  }

  loadSelectedDates(): void {
    const employeeId = 1; // Remplacez cela par l'ID de l'employé approprié
    this.leaveRequestService.getSelectedDatesForEmployee(employeeId).subscribe(
      dates => {
        this.selectedDates = new Set(dates);
      },
      error => {
        console.error('Erreur lors de la récupération des dates sélectionnées', error);
      }
    );
  }

  isDateSelected(date: string): boolean {
    return this.selectedDates.has(date);
  }

  confirmLeaveRequest(): void {
    // Logique pour confirmer les demandes de congé
  }

  // Méthodes ajoutées pour résoudre les erreurs du template
  initializeMonths(): void {
    // Logique pour initialiser les mois
  }

  initializeRows(): void {
    // Logique pour initialiser les lignes
  }

  getOverallWeekNumber(month: any, weekIndex: number): number {
    // Logique pour obtenir le numéro de la semaine
    return 0; // Valeur par défaut
  }

  isDaySelected(day: string, month: any, weekIndex: number): boolean {
    // Logique pour vérifier si un jour est sélectionné
    return false;
  }

  isConfirmedDay(day: string, month: any, weekIndex: number): boolean {
    // Logique pour vérifier si un jour est confirmé
    return false;
  }

  isHighlightedDate(day: string, month: any, weekIndex: number): boolean {
    // Logique pour vérifier si une date est surlignée
    return false;
  }

  toggleDaySelection(day: string, month: any, weekIndex: number): void {
    // Logique pour basculer la sélection d'un jour
  }

  getWeekName(weekIndex: number): string {
    // Logique pour obtenir le nom de la semaine
    return '';
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}
