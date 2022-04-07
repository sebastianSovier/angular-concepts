import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { DialogOverviewExampleDialogComponent } from '../modales/dialog-overview-example-dialog/dialog-overview-example-dialog.component';
import { MantenedorService } from './mantenedor.service';


export class Ciudades {
  pais_id!: number;
  ciudad_id!: number;
  nombre_ciudad!: string;
  region!: string;
  poblacion!: string;
  latitud!: string;
  longitud!: string;
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
  isLinear = false;
  isLinearCiudad = false;
  tituloSecondStep = 'Ingrese Nuevo Pais';
  ingresarFormGroup = new FormGroup({});
  modificarFormGroup = new FormGroup({});
  @ViewChild('stepper')
  myStepper!: MatStepper;
  @ViewChild('stepperCiudad')
  myStepperCiudades!: MatStepper;
  panelOpenState = false;
  ciudades: Ciudades[] = [];
  modificarCiudadFormGroup = new FormGroup({});
  ingresarCiudadFormGroup = new FormGroup({});
  private paginator!: MatPaginator;
  private sort!: MatSort;
  private paginatorCiudad!: MatPaginator;
  private sortCiudad!: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild('paginatorCiudad') set matPaginatorCiudad(mpC: MatPaginator) {
    this.paginatorCiudad = mpC;
    this.setDataSourceAttributes();
  }

  @ViewChild('sortCiudad') set matSortCiudad(msC: MatSort) {
    this.sortCiudad = msC;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSourceCiudad.paginator = this.paginatorCiudad;
    this.dataSourceCiudad.sort = this.sortCiudad;

    if (this.paginator && this.sort) {
      //this.applyFilter();
    }
  }
  pais_id_cache = 0;
  lat = -33.52413039023918;
  lng = -70.82132887007117
  locationChose = false;
  consultaCiudades = false;


  constructor(private route: Router, public dialog: MatDialog, private mantenedorService: MantenedorService, private loading: LoadingPageService, private _formBuilder: FormBuilder) {
  }

  onChoseLocation($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.locationChose = true;
  }
  ngOnInit(): void {
    if (sessionStorage.length === 0 || sessionStorage.getItem('token') === undefined) {
      this.route.navigateByUrl('');
      return;
    }
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
    this.modificarCiudadFormGroup = this._formBuilder.group({
      ciudad_id: [''],
      pais_id: [''],
      nombre_ciudad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      poblacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
    this.ingresarCiudadFormGroup = this._formBuilder.group({
      pais_id: [''],
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

  get IngresaPaisIdCiudad() { return this.ingresarCiudadFormGroup.value.pais_id }
  get IngresanombreCiudad() { return this.ingresarCiudadFormGroup.value.nombre_ciudad }
  get IngresaregionCiudad() { return this.ingresarCiudadFormGroup.value.region }
  get IngresapoblacionCiudad() { return this.ingresarCiudadFormGroup.value.poblacion; }

  get ModificaIdCiudadPais() { return this.modificarCiudadFormGroup.value.pais_id; }
  get ModificaIdCiudad() { return this.modificarCiudadFormGroup.value.ciudad_id; }
  get ModificanombreCiudad() { return this.modificarCiudadFormGroup.value.nombre_ciudad }
  get ModificaregionCiudad() { return this.modificarCiudadFormGroup.value.region }
  get ModificapoblacionCiudad() { return this.modificarCiudadFormGroup.value.poblacion; }


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
    const objeto = {usuario:sessionStorage.getItem('user')!};
    this.mantenedorService.ObtenerPaises(objeto.usuario).subscribe((datos) => {
      this.paisesData = datos.data;
      this.dataSource.data = this.paisesData;
      this.loading.cambiarestadoloading(false);
      console.log(datos);
    });
  }
  ConsultarCiudades(elemento: Paises) {
    this.pais_id_cache = elemento.pais_id;
    this.mantenedorService.ObtenerCiudades(elemento.pais_id.toString()).subscribe((datos) => {
      this.ciudades = datos.data;
      this.CiudadesData = datos.data;
      this.dataSourceCiudad.data = this.CiudadesData;
    });
  }
  volverListaModifica() {
    this.loading.cambiarestadoloading(true);
    this.myStepper.previous();
    this.myStepper.previous();
    this.myStepper.reset();
    this.dataSource.data = [];
    this.paisesData = [];
    this.pais_id_cache = 0;
    this.expandedElement = null;
    this.ConsultarPaises();
  }
  volverListaIngresa() {
    this.loading.cambiarestadoloading(false);
    this.myStepper.previous();
    this.myStepper.reset();

  }
  IrIngresarPais() {
    this.myStepper.next();
  }
  volverListaCiudad() {
    this.resetearCoordenadas();
    this.myStepperCiudades.previous();
    this.myStepperCiudades.previous();
    this.myStepperCiudades.reset();
  }
  volverListaCiudadIngresa() {
    this.resetearCoordenadas();
    this.myStepperCiudades.previous();
    this.myStepperCiudades.reset();
  }
  resetearCoordenadas() {
    this.consultaCiudades = false;
    this.lat = -33.52413039023918;
    this.lng = -70.82132887007117
    this.locationChose = false;
  }
  irAModificar(elemento: Paises) {
    this.ConsultarCiudades(elemento);
    this.modificarFormGroup.setValue({ pais_id: elemento.pais_id, nombre: elemento.nombre_pais, capital: elemento.capital, region: elemento.region, poblacion: elemento.poblacion });
    this.myStepper.next();
    this.myStepper.next();
  }
  iraVerCiudades(elemento: Paises){
    this.consultaCiudades = true;
    this.ConsultarCiudades(elemento);

  }
  IrIngresarCiudad() {
    this.resetearCoordenadas();
    this.ingresarCiudadFormGroup.setValue({ pais_id: this.pais_id_cache, ciudad_id: '', nombre_ciudad: '', poblacion: '', region: '' });
    this.myStepperCiudades.next();
  }
  irAModificarCiudad(elemento: Ciudades) {
    this.modificarCiudadFormGroup.setValue({ ciudad_id: elemento.ciudad_id, pais_id: elemento.pais_id, nombre_ciudad: elemento.nombre_ciudad, region: elemento.region, poblacion: elemento.poblacion });
    this.lat = Number(elemento.latitud);
    this.lng = Number(elemento.longitud);
    this.locationChose = true;
    this.myStepperCiudades.next();
    this.myStepperCiudades.next();
  }
  IngresarPais() {
    this.loading.cambiarestadoloading(true);
    if (this.ingresarFormGroup.valid) {
      const objeto = { nombre_pais: this.Ingresanombre, capital: this.Ingresacapital, region: this.Ingresaregion, poblacion: this.Ingresapoblacion,usuario:sessionStorage.getItem('user') };
      this.mantenedorService.IngresarPais(objeto).subscribe((datos) => {
        this.paisesData = datos.data;
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
      const objeto = { pais_id: this.IngresaPaisIdCiudad, nombre_ciudad: this.IngresanombreCiudad, region: this.IngresaregionCiudad, poblacion: this.IngresapoblacionCiudad, latitud: this.lat.toString(), longitud: this.lng.toString() };
      this.mantenedorService.IngresarCiudad(objeto).subscribe((datos) => {
        this.CiudadesData = datos.data;
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
      const objeto = { pais_id: this.ModificaIdPais, nombre_pais: this.Modificanombre, capital: this.Modificacapital, region: this.Modificaregion, poblacion: this.Modificapoblacion,usuario:sessionStorage.getItem('user') };
      this.mantenedorService.ModificarPais(objeto).subscribe((datos) => {
        this.paisesData = datos.data;
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
    if (this.modificarCiudadFormGroup.valid && this.locationChose === true) {
      const objeto = { pais_id: this.ModificaIdCiudadPais, ciudad_id: this.ModificaIdCiudad, nombre_ciudad: this.ModificanombreCiudad, region: this.ModificaregionCiudad, poblacion: this.ModificapoblacionCiudad, latitud: this.lat.toString(), longitud: this.lng.toString() };
      this.mantenedorService.ModificarCiudad(objeto).subscribe((datos) => {
        this.CiudadesData = datos.data;
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
      this.mantenedorService.EliminarPais(element.element.pais_id.toString(),sessionStorage.getItem('user')!).subscribe((datos) => {
        this.paisesData = datos.data;
        this.dataSource.data = this.paisesData;
        this.loading.cambiarestadoloading(false);
      });
    }
  }
  EliminarCiudad(element: any) {
    if (element === undefined) {
      this.loading.cambiarestadoloading(false);
    } else {
      const objeto = { pais_id: element.element.pais_id.toString(), ciudad_id: element.element.ciudad_id.toString() }
      this.mantenedorService.EliminarCiudad(objeto).subscribe((datos) => {
        this.CiudadesData = datos.data;
        this.dataSourceCiudad.data = this.CiudadesData;
        this.loading.cambiarestadoloading(false);
      });
    }
  }

  openDialog(element: Paises): void {
    this.loading.cambiarestadoloading(true);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '250px',
      data: { element, 'label': 'pais' }
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
      data: { element, 'label': 'ciudad' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.EliminarCiudad(result);
      }
    });
  }

}
