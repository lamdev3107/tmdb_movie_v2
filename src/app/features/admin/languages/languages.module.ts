import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguageListComponent } from './pages/language-list/language-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [LanguageListComponent],
  imports: [
    CommonModule,
    LanguagesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
})
export class LanguagesModule {}
