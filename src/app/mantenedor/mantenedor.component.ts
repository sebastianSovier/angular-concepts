import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { MantenedorService } from './mantenedor.service';


export interface Paises {
  position:number;
  name: string;
  capital: string;
  region: string;
  population: string;
}

@Component({
  selector: 'app-mantenedor',
  templateUrl: './mantenedor.component.html',
  styleUrls: ['./mantenedor.component.scss']
})
export class MantenedorComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'capital', 'region', 'population'];
  paisesData:any[] = [];
  dataSource = new MatTableDataSource<Paises>(this.paisesData);
  selection = new SelectionModel<Paises>(true, []);
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  isLinear = false;
  ingresarFormGroup= new FormGroup({});

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  
  constructor(private mantenedorService:MantenedorService,private loading: LoadingPageService,private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.ConsultarPaises();
    this.dataSource.paginator = this.paginator;
    this.ingresarFormGroup = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        capital: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        region: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        poblacion: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
   
  }
  get nombre() { return this.ingresarFormGroup.value.nombre }

  get capital() { return this.ingresarFormGroup.value.capital; }
  get region() { return this.ingresarFormGroup.value.region }

  get poblacion() { return this.ingresarFormGroup.value.poblacion; }

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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Paises): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ConsultarPaises(){
    this.mantenedorService.ObtenerPaises().subscribe((datos) => {
      this.paisesData = datos;
      this.dataSource.data = this.paisesData;
      this.loading.cambiarestadoloading(false);
      console.log(datos);
    });
  }
  IngresarPais(){}
  ModificarPais(){
    console.log(this.selection.selected);
  }
  EliminarPais(){}
}
