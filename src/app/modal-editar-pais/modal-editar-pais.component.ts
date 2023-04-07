import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { MantenedorService } from '../mantenedor/mantenedor.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-editar-pais',
  templateUrl: './modal-editar-pais.component.html',
  styleUrls: ['./modal-editar-pais.component.scss']
})
export class ModalEditarPaisComponent implements OnInit {
  nombrePaisPattern = "^[a-zA-Z ]*$";
  poblacionPattern = "^[0-9]*$";

  objectPaisEditar: any;

  constructor(public dialogRef: MatDialogRef<ModalEditarPaisComponent>,public dialog: MatDialog, private loading: LoadingPageService,private _formBuilder: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.objectPaisEditar = data.dataKey;
   }

  editarPaisFormGroup = new FormGroup({});

  ngOnInit(): void {
    this.editarPaisFormGroup = this._formBuilder.group({
      pais_id: [this.objectPaisEditar.pais_id],
      nombre_pais: [this.objectPaisEditar.nombre_pais, [Validators.required,Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.nombrePaisPattern)]],
      capital: [this.objectPaisEditar.capital, [Validators.required,Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.nombrePaisPattern)]],
      region: [this.objectPaisEditar.region, [Validators.required,Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.nombrePaisPattern)]],
      poblacion: [this.objectPaisEditar.poblacion, [Validators.required,Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.poblacionPattern)]]  


    });
    this.loading.cambiarestadoloading(false);
  }
  get paisId() { return this.editarPaisFormGroup.value.pais_id }
  get nombrePais() { return this.editarPaisFormGroup.value.nombre_pais }
  get capital() { return this.editarPaisFormGroup.value.capital; }
  get region() { return this.editarPaisFormGroup.value.region; }
  get poblacion() { return this.editarPaisFormGroup.value.poblacion; }


  editarPais(){
    this.loading.cambiarestadoloading(true);
    if (this.editarPaisFormGroup.valid) {
      const objeto = { pais_id: this.paisId, nombre_pais: this.nombrePais, capital: this.capital, region: this.region, poblacion: this.poblacion, usuario: sessionStorage.getItem('user') };
      this.dialogRef.close(objeto);

    }
  }
}
