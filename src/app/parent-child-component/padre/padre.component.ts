import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingPageService } from 'src/app/loading-page/loading-page.service';
import { MantenedorService } from 'src/app/mantenedor/mantenedor.service';
import { ModalEditarPaisComponent } from 'src/app/modal-editar-pais/modal-editar-pais.component';
import { ValidationsService } from 'src/app/shared-components/validations.service';


export class Paises {
  pais_id!: number;
  nombre_pais!: string;
  capital!: string;
  region!: string;
  poblacion!: string;
  fecha_registro!:string;
  usuario_id!:string;
}
@Component({
  selector: 'app-padre',
  templateUrl: './padre.component.html',
  styleUrls: ['./padre.component.scss']
})
export class PadreComponent implements OnInit {

  constructor(private validationService:ValidationsService, private datePipe:DatePipe,private route: Router, public dialog: MatDialog, private mantenedorService: MantenedorService, private loading: LoadingPageService,private _formBuilder: FormBuilder) { }
  paisesData: Paises[] = [];
  busquedaFormGroup = new FormGroup({});

  isValidInput = (fieldName: string | number, form: FormGroup) => this.validationService.isValidInput(fieldName,form);
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  ngOnInit(): void {
    this.busquedaFormGroup = this._formBuilder.group({
      fecha_desde: [new Date("2021-01-01"), [Validators.required]],
      fecha_hasta: [new Date(), [Validators.required,]]  
    });
    this.loading.cambiarestadoloading(false);
  }
  get fechaDesde() { return this.busquedaFormGroup.value.fecha_desde }
  get fechaHasta() { return this.busquedaFormGroup.value.fecha_hasta; }
 
  ConsultarPaisesFechas() {
    //this.loading.cambiarestadoloading(true);
    const objeto = { fecha_desde:this.datePipe.transform(this.fechaDesde,"yyyy-MM-dd"),fecha_hasta:this.datePipe.transform(this.fechaHasta,"yyyy-MM-dd"),usuario: sessionStorage.getItem('user') };
    this.mantenedorService.ObtenerPaisesByFechas(objeto).subscribe((datos) => {
      this.paisesData = datos;
      console.log(datos);
    }, (error) => {
      //this.loading.cambiarestadoloading(false);
      console.log(error);
      if (error.status !== 200) {
        this.route.navigateByUrl('');
      }
    });
  }

  editarPais(element:Paises){
    console.log(element);
    
    let dialogRef = this.dialog.open(ModalEditarPaisComponent,{data: {
      dataKey: element
    }});
    dialogRef.afterClosed().subscribe(result => {
      this.mantenedorService.ModificarPais(result).subscribe((datos) => {
        this.paisesData = datos;
       
      }, (error) => {
        this.loading.cambiarestadoloading(false);
        console.log(error);
        if (error.status !== 200) {
          this.route.navigateByUrl('');
        }
      }, () => {
        this.loading.cambiarestadoloading(false);
      });
    });
  }

  
}
