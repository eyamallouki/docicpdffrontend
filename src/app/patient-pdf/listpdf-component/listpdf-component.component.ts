import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';

@Component({
  selector: 'app-listpdf-component',
  templateUrl: './listpdf-component.component.html',
  styleUrls: ['./listpdf-component.component.css']
})
export class ListpdfComponentComponent {
  constructor(public dialog: MatDialog) {}
  
    openDialog(enterAnimationDuration: string, exitAnimationDuration: string, fileType: string): void {
      this.dialog.open(DialogContentComponent, {
        width: '1000px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: { fileType }
      });
    }
  }
  

