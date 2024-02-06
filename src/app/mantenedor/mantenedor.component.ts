import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { DialogOverviewExampleDialogComponent } from '../modales/dialog-overview-example-dialog/dialog-overview-example-dialog.component';
import { MantenedorService } from './mantenedor.service';
import { saveAs } from 'file-saver';
import { Paises } from '../models/paises';
import { Ciudades } from '../models/ciudades';
import { ValidationsService } from '../shared-components/validations.service';


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
  ingresarFormGroup = new UntypedFormGroup({});
  modificarFormGroup = new UntypedFormGroup({});
  @ViewChild('stepper')
  myStepper!: MatStepper;
  @ViewChild('stepperCiudad')
  myStepperCiudades!: MatStepper;
  panelOpenState = false;
  ciudades: Ciudades[] = [];
  modificarCiudadFormGroup = new UntypedFormGroup({});
  ingresarCiudadFormGroup = new UntypedFormGroup({});
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
  lat: number | undefined = -33.52413039023918;
  lng: number | undefined = -70.82132887007117
  locationChose = false;
  consultaCiudades = false;

  @ViewChild('googleMap', { static: true })
  googleMapRef: ElementRef | undefined;
  map: google.maps.Map | undefined;
  marker: google.maps.Marker | undefined;

  @ViewChild('googleMapMod', { static: true })
  googleMapRefMod: ElementRef | undefined;
  mapMod: google.maps.Map | undefined;
  markerMod: google.maps.Marker | undefined;

  constructor(private validationService: ValidationsService, private route: Router, public dialog: MatDialog, private mantenedorService: MantenedorService, private loading: LoadingPageService, private _formBuilder: UntypedFormBuilder) {
  }
  initMap(tipoMapa: boolean, lat?: string, lng?: string): void {
    if (lat && lng) {
      this.lat = Number(lat);
      this.lng = Number(lng);
    }
    const mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(this.lat!, this.lng!),
      zoom: 9,
      mapTypeId: "roadmap",
    };
    //const input = document.getElementById("pac-input") as HTMLInputElement;
    //const searchBox = new google.maps.places.SearchBox(input);
    if (tipoMapa) {
      this.mapMod = new google.maps.Map(this.googleMapRefMod?.nativeElement, mapOptions);
      this.mapMod.addListener("click", (e) => {
        this.setMarkMap(e.latLng, this.mapMod!);
      });
      /*this.mapMod.addListener("bounds_changed", () => {
        searchBox.setBounds(this.mapMod!.getBounds() as google.maps.LatLngBounds);
      });*/
      this.setMarkMap(undefined, this.mapMod, lat, lng);
      //this.BuscarDireccion(this.mapMod,searchBox);
    } else {
      this.map = new google.maps.Map(this.googleMapRef?.nativeElement, mapOptions);
      this.map.addListener("click", (e) => {
        this.setMarkMap(e.latLng, this.map!, lat, lng);
      });
      /*this.map.addListener("bounds_changed", () => {
        searchBox.setBounds(this.map!.getBounds() as google.maps.LatLngBounds);
      });*/
      //this.BuscarDireccion(this.map,searchBox);
    }

  }
  BuscarDireccion(map: google.maps.Map, searchBox: any) {
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place: { geometry: { location: google.maps.LatLng | google.maps.LatLngLiteral; viewport: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral; }; icon: string; name: any; }) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.

        this.marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
          icon,
        });


        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }
  setMarkMap(latLng?: google.maps.LatLng, map?: google.maps.Map, lat?: string, lng?: string) {
    let coords = new google.maps.LatLng({ lat: this.lat!, lng: this.lng! });
    if (lat && lng) {
      this.lat = Number(lat);
      this.lng = Number(lng);
      coords = new google.maps.LatLng({ lat: this.lat, lng: this.lng });
    }

    if (this.marker) {
      this.marker!.setMap(null);
      this.lat = -33.52413039023918;
      this.lng = -70.82132887007117;
      this.locationChose = false;
    }
    this.marker = new google.maps.Marker({
      position: lat && lng ? coords : latLng,
      map: map,
    });
    if (lat && lng) {
      this.lat = Number(lat);
      this.lng = Number(lng);
      map!.panTo(coords!);
    } else {
      this.lat = latLng!.lat();
      this.lng = latLng!.lng();
      map!.panTo(latLng!);
    }

    this.locationChose = true;
  }


  base64ToBlob(b64Data: string, sliceSize = 512) {
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  ngOnInit(): void {
    this.initMap(false);
    if (sessionStorage.length === 0 || sessionStorage.getItem('token') === undefined) {
      this.route.navigateByUrl('');
      return;
    }
    this.dataSource.sort = this.sort;
    this.ConsultarPaises();
    this.dataSource.paginator = this.paginator;
    this.ingresarFormGroup = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      capital: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      poblacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.poblacionPattern)]]
    });
    this.modificarFormGroup = this._formBuilder.group({
      pais_id: [''],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      capital: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      poblacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.poblacionPattern)]]
    });
    this.modificarCiudadFormGroup = this._formBuilder.group({
      ciudad_id: [''],
      pais_id: [''],
      nombre_ciudad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      poblacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.poblacionPattern)]]
    });
    this.ingresarCiudadFormGroup = this._formBuilder.group({
      pais_id: [''],
      ciudad_id: [''],
      nombre_ciudad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.nombrePaisPattern)]],
      poblacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.validationService.poblacionPattern)]]
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
  isValidInput = (fieldName: string | number, form: UntypedFormGroup) => this.validationService.isValidInput(fieldName, form);
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  applyFilterCiudad(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCiudad.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCiudad.paginator) {
      this.dataSourceCiudad.paginator.firstPage();
    }
  }
  ConsultarPaises() {
    //this.loading.cambiarestadoloading(true);
    const objeto = { usuario: sessionStorage.getItem('user')! };
    this.mantenedorService.ObtenerPaises(objeto.usuario).subscribe((datos) => {
      this.paisesData = datos;
      this.dataSource.data = this.paisesData;
      //this.loading.cambiarestadoloading(false);
      console.log(datos);
    }, (error) => {
      //this.loading.cambiarestadoloading(false);
      console.log(error);
      if (error.status !== 200) {
        this.route.navigateByUrl('');
      }
    });
  }
  ExcelPaises() {
    this.loading.cambiarestadoloading(true);
    const objeto = { usuario: sessionStorage.getItem('user')! };
    this.mantenedorService.ObtenerExcelPaises(objeto.usuario).subscribe((datos) => {
      const myfile = this.base64ToBlob(datos);
      const blob = new Blob([myfile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'MisPaises.xlsx');
    }, (error) => {
      //this.loading.cambiarestadoloading(false);
      console.log(error);
      if (error.status !== 200) {
        this.route.navigateByUrl('');
      }
    }, () => {
      this.loading.cambiarestadoloading(false);
    });
  }
  VolverAtrasPaises() {
    this.consultaCiudades = false;
    this.ciudades = [];
    this.CiudadesData = [];
    this.dataSourceCiudad.data = [];
  }
  ConsultarCiudades(elemento: Paises) {
    //this.loading.cambiarestadoloading(true);
    this.pais_id_cache = elemento.pais_id;
    this.mantenedorService.ObtenerCiudades(elemento.pais_id.toString()).subscribe((datos) => {
      this.ciudades = datos;
      this.CiudadesData = datos;
      this.dataSourceCiudad.data = this.CiudadesData;
      //this.loading.cambiarestadoloading(false);
    }, (error) => {
      //this.loading.cambiarestadoloading(false);
      console.log(error);
      if (error.status !== 200) {
        this.route.navigateByUrl('');
      }
    }, () => {
      //this.loading.cambiarestadoloading(false);
    });
  }
  volverListaModifica() {
    //this.loading.cambiarestadoloading(true);
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
    //this.loading.cambiarestadoloading(false);
    this.myStepper.previous();
    this.myStepper.reset();
    this.ingresarFormGroup.reset();

  }
  IrIngresarPais() {
    this.myStepper.next();
    this.ingresarFormGroup.reset();
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
    this.ingresarCiudadFormGroup.reset();
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
  iraVerCiudades(elemento: Paises) {
    this.consultaCiudades = true;
    this.ConsultarCiudades(elemento);

  }
  IrIngresarCiudad() {
    this.resetearCoordenadas();
    this.initMap(false);
    this.locationChose = false;
    this.ingresarCiudadFormGroup.setValue({ pais_id: this.pais_id_cache, ciudad_id: '', nombre_ciudad: '', poblacion: '', region: '' });
    this.myStepperCiudades.next();
  }
  irAModificarCiudad(elemento: Ciudades) {
    this.modificarCiudadFormGroup.setValue({ ciudad_id: elemento.ciudad_id, pais_id: elemento.pais_id, nombre_ciudad: elemento.nombre_ciudad, region: elemento.region, poblacion: elemento.poblacion });
    this.lat = Number(elemento.latitud);
    this.lng = Number(elemento.longitud);
    this.initMap(true, elemento.latitud, elemento.longitud);
    this.locationChose = true;
    this.myStepperCiudades.next();
    this.myStepperCiudades.next();
  }
  IngresarPais() {
    //this.loading.cambiarestadoloading(true);
    if (this.ingresarFormGroup.valid) {
      const objeto:Paises = { pais_id:0,nombre_pais: this.Ingresanombre, capital: this.Ingresacapital, region: this.Ingresaregion, poblacion: this.Ingresapoblacion, usuario: sessionStorage.getItem('user')! };
      this.mantenedorService.IngresarPais(objeto).subscribe((datos) => {
        this.paisesData = datos;
        this.dataSource.data = this.paisesData;
        this.myStepper.reset()
        this.ingresarFormGroup.reset();
       
      }, (error) => {
        if (error.status !== 200) {
          this.route.navigateByUrl('');
        }
      }, () => {
        //this.loading.cambiarestadoloading(false);
      });
    }
  }
  IngresarCiudad() {
    //this.loading.cambiarestadoloading(true);
    if (this.ingresarCiudadFormGroup.valid && this.locationChose === true) {
      const objeto:Ciudades = { ciudad_id:0,pais_id: this.IngresaPaisIdCiudad, nombre_ciudad: this.IngresanombreCiudad, region: this.IngresaregionCiudad, poblacion: this.IngresapoblacionCiudad, latitud: this.lat!.toString(), longitud: this.lng!.toString() };
      this.mantenedorService.IngresarCiudad(objeto).subscribe((datos) => {
        this.CiudadesData = datos;
        this.dataSourceCiudad.data = this.CiudadesData;
        this.myStepperCiudades.previous();
        this.myStepperCiudades.reset();
        this.ingresarCiudadFormGroup.reset();
      }, (error) => {
        console.log(error);
        if (error.status !== 200) {
          this.route.navigateByUrl('');
        }
      }, () => {
        //this.loading.cambiarestadoloading(false);
      });
    }
  }
  ModificarPais() {
    //this.loading.cambiarestadoloading(true);
    if (this.modificarFormGroup.valid) {
      const objeto:Paises = { pais_id: this.ModificaIdPais, nombre_pais: this.Modificanombre, capital: this.Modificacapital, region: this.Modificaregion, poblacion: this.Modificapoblacion, usuario: sessionStorage.getItem('user')! };
      this.mantenedorService.ModificarPais(objeto).subscribe((datos) => {
        this.paisesData = datos;
        this.dataSource.data = this.paisesData;
        this.myStepper.reset();
        this.myStepper.previous();
        this.myStepper.previous();
        this.modificarFormGroup.reset();
      }, (error) => {
        console.log(error);
        if (error.status !== 200) {
          this.route.navigateByUrl('');
        }
      }, () => {
        //this.loading.cambiarestadoloading(false);
      });
    }
  }
  ModificarCiudad() {
    //this.loading.cambiarestadoloading(true);
    if (this.modificarCiudadFormGroup.valid && this.locationChose === true) {
      const objeto = { pais_id: this.ModificaIdCiudadPais, ciudad_id: this.ModificaIdCiudad, nombre_ciudad: this.ModificanombreCiudad, region: this.ModificaregionCiudad, poblacion: this.ModificapoblacionCiudad, latitud: this.lat!.toString(), longitud: this.lng!.toString() };
      this.mantenedorService.ModificarCiudad(objeto).subscribe((datos) => {
        this.CiudadesData = datos;
        this.dataSourceCiudad.data = this.CiudadesData;
        this.myStepperCiudades.reset();
        this.myStepperCiudades.previous();
        this.myStepperCiudades.previous();
        this.modificarCiudadFormGroup.reset();
      }, (error) => {
        console.log(error);
        if (error.status !== 200) {
          this.route.navigateByUrl('');
        }
      }, () => {
        //this.loading.cambiarestadoloading(false);
      });
    }
  }
  EliminarPais(element: any) {
    if (element === undefined) {
      //this.loading.cambiarestadoloading(false);
      return;
    } else {
      this.mantenedorService.EliminarPais(element.element.pais_id.toString(), sessionStorage.getItem('user')!).subscribe((datos) => {
        this.paisesData = datos;
        this.dataSource.data = this.paisesData;
      }, (error) => {
        console.log(error);
      }, () => {
        //this.loading.cambiarestadoloading(false);
      });
    }
  }
  EliminarCiudad(element: Ciudades) {
    if (element === undefined) {
      //this.loading.cambiarestadoloading(false);
      return;
    } else {
      const objeto :Ciudades = { pais_id: element.pais_id, ciudad_id: element.ciudad_id,nombre_ciudad:"", region:"", poblacion:"", latitud:"", longitud:"" }
      this.mantenedorService.EliminarCiudad(objeto).subscribe((datos) => {
        this.CiudadesData = datos;
        this.dataSourceCiudad.data = this.CiudadesData;
      }, (error) => {
        console.log(error);
        if (error.status !== 200) {
          this.route.navigateByUrl('');
        }
      }, () => {
        //this.loading.cambiarestadoloading(false);
      });
    }
  }

  openDialog(element: Paises): void {
    //this.loading.cambiarestadoloading(true);
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
    //this.loading.cambiarestadoloading(true);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '350px',
      data: { element, 'label': 'ciudad' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.EliminarCiudad(result.element);
      }
    });
  }

}
