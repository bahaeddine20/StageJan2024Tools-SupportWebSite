import { SafeUrl } from "@angular/platform-browser";

export interface User {
    id?: number;  // Optional if not always present (e.g., before creation)
    username?: string;
    email?: string;
    password?: string;
    city?: string;
    position?: string;
    confirmPassword?:string;
    linkedInLink?: string;
    gitLink?: string;
    personalLink?: string;
    profileImage?: ProfileImage[]; // This could be a string URL or any other format depending on your implementation
    roles?: string[];  // Array of roles if applicable
  }
  export interface ProfileImage {
    id: number;
    name: string;
    type?: string;
    picByte?: string;
    file: File;
    url?: string | SafeUrl; // Allow url to be string or SafeUrl
  }
  
  