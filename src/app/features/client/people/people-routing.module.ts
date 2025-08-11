import { components } from './../home/components/index';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './pages/people/people.component';
import { PeopleDetailComponent } from './pages/people-detail/people-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PeopleComponent,
  },
  {
    path: ':id',
    component: PeopleDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule {}
