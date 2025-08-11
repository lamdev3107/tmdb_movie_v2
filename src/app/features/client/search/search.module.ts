import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { components } from './components';
import { FormsModule } from '@angular/forms';
import { pages } from './pages';
@NgModule({
  declarations: [...components, ...pages],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
  ],
})
export class SearchModule {}
