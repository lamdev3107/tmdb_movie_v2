import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleListComponent } from './pages/people-list/people-list.component';
import { CreatePeopleComponent } from './pages/create-people/create-people.component';
import { EditPeopleComponent } from './pages/edit-people/edit-people.component';

const routes: Routes = [
  {
    path: '',
    component: PeopleListComponent,
  },
  {
    path: 'create',
    component: CreatePeopleComponent,
  },
  {
    path: 'edit/:id',
    component: EditPeopleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule {}
