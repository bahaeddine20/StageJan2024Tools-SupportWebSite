import { SafeUrl } from "@angular/platform-browser";
import { Employee } from "../employees/employee";


export interface Team {
    id: number;
    name: string;
    description: string;
    technologie:string;
    teamImages?: TeamImage[];
    employees: Employee[];
  }
  
  export interface TeamImage {
    id: number;
    name: string;
    type?: string;
    picByte?: string;
    file: File;
    url?: SafeUrl;
  }