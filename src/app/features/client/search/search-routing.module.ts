import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TvComponent } from './pages/tv/tv.component';
import { MovieComponent } from './pages/movie/movie.component';
import { PersonComponent } from './pages/person/person.component';
import { SearchLayoutComponent } from './components/search-layout/search-layout.component';
const routes: Routes = [
  {
    path: '',
    component: SearchLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'movie',
      },
      {
        path: 'tv',
        component: TvComponent,
      },
      {
        path: 'movie',
        component: MovieComponent,
      },
      {
        path: 'person',
        component: PersonComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
