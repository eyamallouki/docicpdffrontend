export interface PDF {
  id: number;
  titre: string;
  total_pages: number;
  categorie: string;
  etat: 'traité' | 'non_traité';
  file: string | null; // Path to the PDF file
  patient_associé: number; // Assuming this is the ID of the User
  date_creation: string; // ISO date string
  date_modification: string; // ISO date string
  images: Image[]; // Array of associated images
}

export interface Image {
  id: number;
  file: string; // Path to the image file
  page_number: number;
  pdf: number | null; // ID of the associated PDF
}

export interface Page {
  id: number;
  pdf: number; // ID of the associated PDF
  numéro: number;
  orientation: string;
}
