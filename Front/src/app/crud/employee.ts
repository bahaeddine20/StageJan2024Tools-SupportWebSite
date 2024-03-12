import { SafeUrl } from "@angular/platform-browser";
import { Team } from "./team";

export interface Employee {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    gender: string;
    employeeImages?: EmployeeImage[];
    team: Team;
  }
  
  export interface EmployeeImage {
    id: number;
    name: string;
    type?: string;
    picByte?: string;
    file: File;
    url?: SafeUrl;
  }
 
  