import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingPageService } from 'src/app/loading-page/loading-page.service';
import { Output, EventEmitter } from '@angular/core';
import { Paises } from '../padre/padre.component';



@Component({
  selector: 'app-hijo',
  templateUrl: './hijo.component.html',
  styleUrls: ['./hijo.component.scss']
})
export class HijoComponent implements OnInit, OnChanges,AfterViewInit {
  @Input() PaisesInput: Paises[] = [];
  showTable: boolean = false;
  displayedColumns: string[] = ['nombre_pais', 'capital', 'region', 'poblacion', 'fecha_registro','acciones'];
  dataSource! : MatTableDataSource<Paises>;
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @Output() editarPaisEvent = new EventEmitter<Paises>();
  constructor(private loading: LoadingPageService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.PaisesInput);
    console.log(this.dataSource);
  }

  ngOnChanges(): void {
    if (this.PaisesInput.length > 0) {
      this.dataSource = new MatTableDataSource(this.PaisesInput);
      this.showTable = true;
    }else{
      this.dataSource = new MatTableDataSource<Paises>([]);
      this.showTable = false;

    }
    console.log(this.dataSource);
    this.loading.cambiarestadoloading(false);
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editarPais(element:Paises) {
    this.editarPaisEvent.emit(element);
  }
}
