interface LeaveRequest {
    id: number | null;          // Identifiant de la demande de congé (peut être null pour les nouvelles demandes)
    employeeId: number;         // Identifiant de l'employé pour lequel la demande de congé est faite
    startDate: Date;            // Date de début de la demande de congé
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';  // Statut de la demande de congé
  }
  