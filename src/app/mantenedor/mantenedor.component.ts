import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { DialogOverviewExampleDialogComponent } from '../modales/dialog-overview-example-dialog/dialog-overview-example-dialog.component';
import { MantenedorService } from './mantenedor.service';



export class Ciudades {
  pais_id!: number;
  ciudad_id!: number;
  nombre_ciudad!: string;
  region!: string;
  poblacion!: string;
}
export class Paises {
  pais_id!: number;
  nombre_pais!: string;
  capital!: string;
  region!: string;
  poblacion!: string;
  ciudades: Ciudades[] = [];
}
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-mantenedor',
  templateUrl: './mantenedor.component.html',
  styleUrls: ['./mantenedor.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MantenedorComponent implements OnInit {
  expandedElement: Ciudades | null | undefined;
  animal = '';
  name = '';
  displayedColumns: string[] = ['nombre_pais', 'capital', 'region', 'poblacion', 'acciones'];
  paisesData: Paises[] = [];
  dataSource = new MatTableDataSource<Paises>(this.paisesData);
  selection = new SelectionModel<Paises>(true, []);
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  isLinear = false;
  tituloSecondStep = 'Ingrese Nuevo Pais';
  ingresarFormGroup = new FormGroup({});
  modificarFormGroup = new FormGroup({});
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('stepper')
  myStepper!: MatStepper;
  panelOpenState = false;
  ciudades: Ciudades[] = [];

  constructor(public dialog: MatDialog, private mantenedorService: MantenedorService, private loading: LoadingPageService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loading.cambiarestadoloading(true);
    this.dataSource.sort = this.sort;
    this.ConsultarPaises();
    this.dataSource.paginator = this.paginator;
    this.ingresarFormGroup = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      capital: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      poblacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
    this.modificarFormGroup = this._formBuilder.group({
      pais_id: [''],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      capital: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      poblacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });

  }
  get Ingresanombre() { return this.ingresarFormGroup.value.nombre }
  get Ingresacapital() { return this.ingresarFormGroup.value.capital; }
  get Ingresaregion() { return this.ingresarFormGroup.value.region }
  get Ingresapoblacion() { return this.ingresarFormGroup.value.poblacion; }

  get ModificaIdPais() { return this.modificarFormGroup.value.pais_id; }
  get Modificanombre() { return this.modificarFormGroup.value.nombre }
  get Modificacapital() { return this.modificarFormGroup.value.capital; }
  get Modificaregion() { return this.modificarFormGroup.value.region }
  get Modificapoblacion() { return this.modificarFormGroup.value.poblacion; }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ConsultarPaises() {
    this.mantenedorService.ObtenerPaises().subscribe((datos) => {
      this.paisesData = datos;
      this.dataSource.data = this.paisesData;
      this.loading.cambiarestadoloading(false);
      console.log(datos);
    });
  }
  ConsultarCiudades(elemento: Paises) {
    this.mantenedorService.ObtenerCiudades(elemento.pais_id.toString()).subscribe((datos) => {
      this.ciudades = datos;
     /* this.paisesData.forEach(element => {
        for (let index = 0; index < ciudades.length; index++) {
          const elementCiudad = ciudades[index];
          if (element.pais_id === elementCiudad.pais_id) {
            element.ciudades = ciudades
          }
        }*/

    //  this.dataSource.data = this.paisesData;

      console.log(datos);
    });
  }
  volverListaModifica() {
    this.loading.cambiarestadoloading(true);
    this.myStepper.previous();
    this.myStepper.previous();
    this.myStepper.reset();
    this.loading.cambiarestadoloading(false);
  }
  volverListaIngresa() {
    this.loading.cambiarestadoloading(true);
    this.myStepper.previous();
    this.myStepper.reset();
    this.loading.cambiarestadoloading(false);
  }
  IrIngresarPais() {
    this.myStepper.next();
  }
  irAModificar(elemento: Paises) {
    this.modificarFormGroup.setValue({ pais_id: elemento.pais_id, nombre: elemento.nombre_pais, capital: elemento.capital, region: elemento.region, poblacion: elemento.poblacion });
    this.myStepper.next();
    this.myStepper.next();
  }
  IngresarPais() {
    this.loading.cambiarestadoloading(true);
    if (this.ingresarFormGroup.valid) {
      const objeto = { nombre_pais: this.Ingresanombre, capital: this.Ingresaregion, region: this.Ingresaregion, poblacion: this.Ingresapoblacion };
      this.mantenedorService.IngresarPais(objeto).subscribe((datos) => {
        this.paisesData = datos;
        this.dataSource.data = this.paisesData;
        this.myStepper.previous();
        this.loading.cambiarestadoloading(false);
      });
    } else {

    }
  }
  ModificarPais() {
    this.loading.cambiarestadoloading(true);
    if (this.modificarFormGroup.valid) {
      const objeto = { pais_id: this.ModificaIdPais, nombre_pais: this.Modificanombre, capital: this.Modificacapital, region: this.Modificaregion, poblacion: this.Modificapoblacion };
      this.mantenedorService.ModificarPais(objeto).subscribe((datos) => {
        this.paisesData = datos;
        this.dataSource.data = this.paisesData;
        this.myStepper.reset();
        this.myStepper.previous();
        this.myStepper.previous();
        this.loading.cambiarestadoloading(false);
      });
    }
  }
  EliminarPais(element: any) {
    if (element === undefined) {
      this.loading.cambiarestadoloading(false);
    } else {
      this.mantenedorService.EliminarPais(element.element.pais_id.toString()).subscribe((datos) => {
        this.paisesData = datos;
        this.dataSource.data = this.paisesData;
        this.loading.cambiarestadoloading(false);
      });
    }
  }
  openDialog(element: Paises): void {
    this.loading.cambiarestadoloading(true);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '250px',
      data: { element }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.EliminarPais(result);
    });
  }

}
