import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleListComponent } from './pages/people-list/people-list.component';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CreatePeopleComponent } from './pages/create-people/create-people.component';
import { PersonFormComponent } from './components/person-form/person-form.component';
import { EditPeopleComponent } from './pages/edit-people/edit-people.component';

@NgModule({
  declarations: [
    PeopleListComponent,
    CreatePeopleComponent,
    PersonFormComponent,
    EditPeopleComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PeopleRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
})
export class PeopleModule {}
