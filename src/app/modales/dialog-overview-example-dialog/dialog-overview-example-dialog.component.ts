import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingPageService } from 'src/app/loading-page/loading-page.service';

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.component.html',
  styleUrls: ['./dialog-overview-example-dialog.component.scss']
})
export class DialogOverviewExampleDialogComponent implements OnInit {
  titulo = '';
  subtitulo = '';

 
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCiudad: any,@Inject(MAT_DIALOG_DATA) public dataPais:any,private loading:LoadingPageService) {
      if(dataCiudad.label === 'ciudad'){
        this.titulo = 'de Ciudad'
        this.subtitulo = 'esta Ciudad';
      }
      if(dataPais.label === 'pais'){
        this.titulo = 'de Pais'
        this.subtitulo = 'este Pais';
      }
      this.loading.cambiarestadoloading(false);
    }

    ngOnInit(){
     
    }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
