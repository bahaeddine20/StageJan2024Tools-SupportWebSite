import { SafeUrl } from "@angular/platform-browser";
import { Team } from "../teams/team";


export interface Employee {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    gender: string;
    phone: number;
    linkedin:string;
    role:string;
    employeeImages?: EmployeeImage[];
    team: Team;
    imageUrl?: SafeUrl | null;
  }
  
  export interface EmployeeImage {
    id: number;
    name: string;
    type?: string;
    picByte?: string;
    file: File;
    url?: SafeUrl;
  }
 
  