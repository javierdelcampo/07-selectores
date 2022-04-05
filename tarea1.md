1- paises.module.ts

     ng g m paises --routing

2- paises-routing.module.ts

    (hecho con el paso anterior)

3- selectorPage / pages

    ng g c paises/pages/selectorPage --skip-tests -is

4- paisesService

    ng g s paises/services/paises --skip-tests

5- 
{
    path: '',
    children: [
        { path: 'selector', component: selectorPage },
        { path: '**', redirectTo: 'selector' }
    ]
}

6- cargar mediante LazyLoad el módulo paises.module

    En app-routing.module.ts
        { 
            path: 'selector',
            loadChildren: () => import('./paises/paises.module').then( m => m.PaisesModule )
        },
        {
            path: '**',
            redirectTo: 'selector'
        }