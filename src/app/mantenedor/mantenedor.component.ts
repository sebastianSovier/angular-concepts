import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  constructor(private mantenedorService:MantenedorService,private loading: LoadingPageService,) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.ConsultarPaises();
    this.dataSource.paginator = this.paginator;
   
  }
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
