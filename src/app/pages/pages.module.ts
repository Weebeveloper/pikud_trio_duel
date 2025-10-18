import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomePageComponent, PersonDetailsPageComponent } from './index';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginPageComponent } from './login/login.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomePageComponent,
    PersonDetailsPageComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [HomePageComponent, PersonDetailsPageComponent, LoginPageComponent],
})
export class PagesModule {}
