import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomePageComponent, PersonDetailsPageComponent } from './index';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { LoginPageComponent } from './login/login.page';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoryPageComponent } from './history/history.page';

@NgModule({
  declarations: [
    HomePageComponent,
    PersonDetailsPageComponent,
    LoginPageComponent,
    HistoryPageComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSnackBarModule,
  ],
  exports: [HomePageComponent, PersonDetailsPageComponent, LoginPageComponent],
})
export class PagesModule {}
