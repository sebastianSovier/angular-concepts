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
  expandedElement: Paises | null | undefined;
  displayedColumns: string[] = ['nombre_pais', 'capital', 'region', 'poblacion', 'acciones'];
  displayedColumnsCiudad: string[] = ['nombre_ciudad', 'region', 'poblacion', 'acciones'];
  paisesData: Paises[] = [];
  CiudadesData: Ciudades[] = [];
  dataSource = new MatTableDataSource<Paises>(this.paisesData);
  dataSourceCiudad = new MatTableDataSource<Ciudades>(this.CiudadesData);
  selection = new SelectionModel<Paises>(true, []);
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild('paginatorCiudad', { static: true })
  paginatorCiudades!: MatPaginator;
  isLinear = false;
  isLinearCiudad = false;
  tituloSecondStep = 'Ingrese Nuevo Pais';
  ingresarFormGroup = new FormGroup({});
  modificarFormGroup = new FormGroup({});
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('matSortCiudad', { static: true })
  sortCiudades!: MatSort;
  @ViewChild('stepper')
  myStepper!: MatStepper;
  @ViewChild('stepperCiudad')
  myStepperCiudades!: MatStepper;
  panelOpenState = false;
  ciudades: Ciudades[] = [];
  modificarCiudadFormGroup = new FormGroup({});
  ingresarCiudadFormGroup = new FormGroup({});

  constructor(public dialog: MatDialog, private mantenedorService: MantenedorService, private loading: LoadingPageService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loading.cambiarestadoloading(true);
    this.dataSource.sort = this.sort;
    this.dataSourceCiudad.sort = this.sortCiudades
    this.ConsultarPaises();
    this.dataSource.paginator = this.paginator;
    this.dataSourceCiudad.paginator = this.paginatorCiudades;
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
    this.modificarCiudadFormGroup = this._formBuilder.group({
      ciudad_id: [''],
      pais_id: [''],
      nombre_ciudad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      poblacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
    this.ingresarCiudadFormGroup = this._formBuilder.group({
      ciudad_id: [''],
      nombre_ciudad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
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

  get IngresanombreCiudad() { return this.ingresarCiudadFormGroup.value.nombre_ciudad }
  get IngresaregionCiudad() { return this.ingresarCiudadFormGroup.value.region }
  get IngresapoblacionCiudad() { return this.ingresarCiudadFormGroup.value.poblacion; }

  get ModificaIdCiudad() { return this.modificarCiudadFormGroup.value.ciudad_id; }
  get ModificanombreCiudad() { return this.modificarCiudadFormGroup.value.nombre_ciudad }
  get ModificaregionCiudad() { return this.modificarCiudadFormGroup.value.region }
  get ModificapoblacionCiudad() { return this.modificarCiudadFormGroup.value.poblacion; }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSourceCiudad.sort = this.sortCiudades
    this.dataSourceCiudad.paginator = this.paginatorCiudades;

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilterCiudad(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCiudad.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCiudad.paginator) {
      this.dataSourceCiudad.paginator.firstPage();
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
      this.CiudadesData = datos;
      this.dataSourceCiudad.data = this.CiudadesData;
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
    this.ConsultarCiudades(elemento);
    this.modificarFormGroup.setValue({ pais_id: elemento.pais_id, nombre: elemento.nombre_pais, capital: elemento.capital, region: elemento.region, poblacion: elemento.poblacion });
    this.myStepper.next();
    this.myStepper.next();
  }
  IrIngresarCiudad() {
    this.myStepperCiudades.next();
  }
  irAModificarCiudad(elemento: Ciudades) {
    this.modificarCiudadFormGroup.setValue({ ciudad_id:elemento.ciudad_id,pais_id: elemento.pais_id, nombre_ciudad: elemento.nombre_ciudad,region: elemento.region, poblacion: elemento.poblacion });
    this.myStepperCiudades.next();
    this.myStepperCiudades.next();
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
  IngresarCiudad() {
    this.loading.cambiarestadoloading(true);
    if (this.ingresarCiudadFormGroup.valid) {
      const objeto = { nombre_ciudad: this.Ingresanombre, capital: this.Ingresaregion, region: this.Ingresaregion, poblacion: this.Ingresapoblacion };
      this.mantenedorService.IngresarCiudad(objeto).subscribe((datos) => {
        this.CiudadesData = datos;
        this.dataSourceCiudad.data = this.CiudadesData;
        this.myStepperCiudades.previous();
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
  ModificarCiudad() {
    this.loading.cambiarestadoloading(true);
    if (this.modificarCiudadFormGroup.valid) {
      const objeto = { pais_id: this.ModificaIdPais, nombre_pais: this.Modificanombre, capital: this.Modificacapital, region: this.Modificaregion, poblacion: this.Modificapoblacion };
      this.mantenedorService.ModificarCiudad(objeto).subscribe((datos) => {
        this.CiudadesData = datos;
        this.dataSourceCiudad.data = this.CiudadesData;
        this.myStepperCiudades.reset();
        this.myStepperCiudades.previous();
        this.myStepperCiudades.previous();
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
  EliminarCiudad(element: any) {
    if (element === undefined) {
      this.loading.cambiarestadoloading(false);
    } else {
      this.mantenedorService.EliminarCiudad(element.element.ciudad_id.toString()).subscribe((datos) => {
        this.CiudadesData = datos;
        this.dataSourceCiudad.data = this.CiudadesData;
        this.loading.cambiarestadoloading(false);
      });
    }
  }

  openDialog(element: Paises): void {
    this.loading.cambiarestadoloading(true);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '250px',
      data: { element,'label':'pais' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.EliminarPais(result);
      }
    });
  }
  openDialogCiudad(element: Ciudades): void {
    this.loading.cambiarestadoloading(true);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '350px',
      data: { element,'label':'ciudad'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.EliminarCiudad(result);
      }
    });
  }

}
