import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmallv3 } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group ({
    region:    [ '', Validators.required ],
    pais:      [ '', Validators.required ],
    fronteras: [ '', Validators.required ]
  })

  // rellenar selectores
  regiones: string[] = [];
  paises: PaisSmallv3[] = [];
  //fronteras: string[]= [] ;
  fronteras: PaisSmallv3[]= [] ;

  cargando: boolean = false;

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // cuando cambia la región
    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe( region => {
    //     console.log(region);
    //     this.paisesService.getPaisesPorRegion( region )
    //       .subscribe(paises => {
    //         this.paises = paises;
    //         console.log(this.paises);
            
    //       })
    //   })

    this.miFormulario.get('region')?.valueChanges
      .pipe (
        tap( ( _ ) => {   // No me importa el argumento...
          this.miFormulario.get('pais')?.reset(''); // cada vez que cambia la región, reseteamos el valor del país para no dejar inconsistencias
          this.miFormulario.get('fronteras')?.disable();
          this.cargando = true;
        }),
        switchMap ( region => this.paisesService.getPaisesPorRegion( region )),
      )
      .subscribe( paises => {
        console.log( 'Region', paises );
        this.cargando = false;
        this.paises = paises.sort((a,b) => a.name.common.localeCompare(b.name.common));
      })

    this.miFormulario.get('pais')?.valueChanges
      .pipe (
        tap( ( _ ) => {
          this.fronteras = [];
          this.miFormulario.get('fronteras')?.reset(''); // cada vez que cambia la región, reseteamos el valor del país para no dejar inconsistencias
          this.miFormulario.get('fronteras')?.enable();
          this.cargando = true;
        }),
        switchMap ( codigo => this.paisesService.getPaisPorCodigo( codigo )),
        switchMap ( pais => this.paisesService.getPaisesPorCodigos( pais[0]?.borders! ))
      )
      .subscribe( paises => {
        this.fronteras = paises;
        this.cargando = false;
        
        // if (pais.length > 0) {
        //   this.fronteras = pais.borders || [];
        // }
      })

  }

  guardar() {
    console.log(this.miFormulario.value);
    
  }

}
