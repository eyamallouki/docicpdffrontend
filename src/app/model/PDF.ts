export interface PDF {
    id: number;
    titre: string;
    total_pages: number;
    categorie: string;
    etat: 'traité' | 'non_traité';
    patient_associé: number; // Remplacer par le type approprié pour l'ID de l'utilisateur
  }
  
  export interface Page {
    id: number;
    pdf: PDF;
    numéro: number;
    orientation: string;
  }
  