export interface DataPerfJira {
  id: number;
  start_date: string;
  end_date: string;
  sprint_name: string;
  grouped_bar_chart: any;
  pie_chart: any;
  histogram: any;
  date_genere: string; 
  idsprint: number;
  isDeleted?: boolean;  // Propriété optionnelle pour marquer les éléments supprimés

  // Add the new field here
}
