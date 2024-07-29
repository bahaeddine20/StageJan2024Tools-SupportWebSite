interface LeaveRequest {
  id: number;
  employeeEmail: string;
  employeeId: number;
  selectedDates: string[]; // Dates en format ISO string
  confirmed: boolean;
}
