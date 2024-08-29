export  interface Team {
  id: number;
}

export interface Sprint {
  id?:number;
  name: string;
  description: string;
  date_Debut: string;
  date_Fin: string;
  team: Team;
    color?: string; // Add the optional color property

}