import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const URL = 'http://localhost:3000/api/v1';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  httpOptions:any = {};

  constructor(
    private http: HttpClient
  ) {
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json'}) };
  }



  /** Obtenemos los cargos por EP */
  getCargosService() {
    return this.http.get<any>(`${URL}/cargo`, this.httpOptions).pipe( response => response )
  }

  /** Obtenemos los cargos por EP */
  getEmpleadosService() {
    return this.http.get<any>(`${URL}/empleado`, this.httpOptions).pipe( response => response )
  }


  /**Obtenemos los empelados por cargo */
  getEmpleadosByIdService(id:any) {
    return this.http.get<any>(`${URL}/empleado?cargoId=${id}`, this.httpOptions).pipe( response => response )
  }





}
