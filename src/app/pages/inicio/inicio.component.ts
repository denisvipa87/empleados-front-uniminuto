import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { EmpleadosColumn } from 'src/app/interfaces/empleados.interfaces';
import { EmpleadosService } from 'src/app/services/empleados.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  empleadosColumn = EmpleadosColumn;
  dataSource!: MatTableDataSource<any>;
  cargoSelected!: number|string;
  cargos:any;
  empleados:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private empleadosSrv: EmpleadosService,
    private paginatorIntl: MatPaginatorIntl,
  ){
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
  }

  ngOnInit(): void {
    this._initInfoBase();
  }


  /**Consultamos los datos base */
  private _initInfoBase() {
    forkJoin({
      cargos: this.empleadosSrv.getCargosService(),
      empleados: this.empleadosSrv.getEmpleadosService()
    }).subscribe({
      next: (response:any) => {
        this.cargos = response.cargos;
        this.empleados = response.empleados;
        this.initTableEmpleados(this.empleados)
      },
      error: error =>{
        this._openSnackBar('No es posible cargar la información.', 'ERROR!');
        console.error(error);
        
      }
    })
  }


  /**Inicia la tabla de material */
  initTableEmpleados(data:any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  /**Cambiamos el resultado del filtro por cargo seleccionado */
  onChangeCargo(event:any) {
    console.log(event.value);
    this.empleadosSrv.getEmpleadosByIdService(event.value).subscribe({
      next: (response:any) => {
        this.initTableEmpleados(response)
      },
      error: error =>{
        this._openSnackBar('No es posible cargar la información.', 'ERROR!');
        console.error(error);
      }
    })
    // const filterEmpleados = this.empleados.filter( (item:any) => item.cargo.id == event.value);
  }


  /**Muestra barra de mensaje */
  private _openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }


  /**Limpiamos los filtros */
  clearFilter() {
    this.initTableEmpleados(this.empleados);
    this.cargoSelected = '';
  }


  /** Aplica los filtros del campo búsqueda */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
