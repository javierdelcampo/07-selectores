import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pais, PaisSmallv3 } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1'
  private _regiones: string[] = [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) { }


  getPaisesPorRegion (region: string): Observable<PaisSmallv3[]> {
    const url: string = `${ this._baseUrl }/region/${region}?fields=cca3,name`;
    return this.http.get<PaisSmallv3[]>( url );
  }

  getPaisPorCodigo (codigo: string): Observable<Pais[] | []> {
    if (!codigo) {
      return of([])
    }

    const url: string = `${ this._baseUrl }/alpha/${ codigo }`
    return this.http.get<Pais[]>( url );
  }

  getPaisPorCodigoReducido (codigo: string): Observable<PaisSmallv3> {
    const url: string = `${ this._baseUrl }/alpha/${ codigo }?fields=cca3,name`
    return this.http.get<Pais>( url );
  }

  getPaisesPorCodigos ( codigos: string[] ): Observable<PaisSmallv3[]> {
    if (!codigos) {
      return of([]);
    }

    const peticiones: Observable<PaisSmallv3>[] = [];

    codigos.forEach( codigo => {
      const peticion = this.getPaisPorCodigoReducido(codigo);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );

  }


}

