// Interface représentant une image extraite
export interface ExtractedImage {
  id: number;
  image: string; // Chemin vers le fichier image
  page_number: number;
  crop_coordinates?: CropCoordinates; // Coordonnées de recadrage optionnelles
  date_extraction: string; // Date de l'extraction sous forme de chaîne ISO
  pdf_document: number; // ID du PDF associé
}

// Interface pour les coordonnées de recadrage
export interface CropCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Interface représentant une page de PDF
export interface Page {
  id: number;
  pdf: number; // ID du PDF associé
  numéro: number; // Numéro de la page
  orientation: string; // Orientation de la page
}

// Interface représentant une image liée à un PDF
export interface Image {
  id: number;
  file: string; // Chemin vers le fichier image
  page_number: number;
  pdf: number | null; // ID du PDF associé ou null si non associé
}

// Interface représentant un PDF
export interface PDF {
  id: number;
  titre: string;
  total_pages: number;
  categorie: string;
  etat: 'traité' | 'non_traité';
  file: string | null; // Chemin vers le fichier PDF
  patient_associé: number; // ID du patient associé (l'utilisateur)
  date_creation: string; // Date de création sous forme de chaîne ISO
  date_modification: string; // Date de modification sous forme de chaîne ISO
  images: Image[]; // Tableau des images associées
  filtered_text?: string; // Texte filtré (optionnel)
  extracted_images?: ExtractedImage[]; // Tableau des images extraites (optionnel)
}
