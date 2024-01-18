import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationsService } from '../shared-components/validations.service';

@Component({
  selector: 'app-modal-editar-pais',
  templateUrl: './modal-editar-pais.component.html',
  styleUrls: ['./modal-editar-pais.component.scss']
})
export class ModalEditarPaisComponent implements OnInit {
  nombrePaisPattern = "^[a-zA-Z ]*$";
  poblacionPattern = "^[0-9]*$";

  objectPaisEditar: any;

  constructor(public validations:ValidationsService,public dialogRef: MatDialogRef<ModalEditarPaisComponent>, public dialog: MatDialog, private loading: LoadingPageService, private _formBuilder: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.objectPaisEditar = data.dataKey;
  }

  editarPaisFormGroup = this._formBuilder.group({
    pais_id: [0],
    nombre_pais: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.nombrePaisPattern)]],
    capital: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.nombrePaisPattern)]],
    region: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.nombrePaisPattern)]],
    poblacion: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.poblacionPattern)]]


  });

  ngOnInit(): void {
    this.editarPaisFormGroup.setValue({
      pais_id: this.objectPaisEditar.pais_id, nombre_pais: this.objectPaisEditar.nombre_pais, capital: this.objectPaisEditar.capital,
      region: this.objectPaisEditar.region, poblacion: this.objectPaisEditar.poblacion
    });
   this.loading.cambiarestadoloading(false);
  }
  get paisId() { return this.editarPaisFormGroup.value.pais_id }
  get nombrePais() { return this.editarPaisFormGroup.value.nombre_pais }
  get capital() { return this.editarPaisFormGroup.value.capital; }
  get region() { return this.editarPaisFormGroup.value.region; }
  get poblacion() { return this.editarPaisFormGroup.value.poblacion; }


  editarPais() {
   // this.loading.cambiarestadoloading(true);
    if (this.editarPaisFormGroup.valid) {
      const objeto = { pais_id: this.paisId, nombre_pais: this.nombrePais, capital: this.capital, region: this.region, poblacion: this.poblacion, usuario: sessionStorage.getItem('user') };
      this.dialogRef.close(objeto);

    }
  }

 
}
