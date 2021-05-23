import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingPageService } from 'src/app/loading-page/loading-page.service';
import { DialogData } from 'src/app/mantenedor/mantenedor.component';

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.component.html',
  styleUrls: ['./dialog-overview-example-dialog.component.scss']
})
export class DialogOverviewExampleDialogComponent implements OnInit {


 
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private loading:LoadingPageService) {
      this.loading.cambiarestadoloading(false);
    }

    ngOnInit(){
     
    }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
