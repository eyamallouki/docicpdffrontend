// notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar, private _snackBar: MatSnackBar) { }

  showSuccess(message: string): void {
   
      this._snackBar.open('Vérifiez votre boîte email pour activer votre compte', 'Fermer', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['custom-snackbar'] // Ajoutez votre classe CSS personnalisée ici
      });
    }
}
