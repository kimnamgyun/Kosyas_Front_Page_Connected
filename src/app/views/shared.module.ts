import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LocalizePipe} from '../localization';
import {BreadcrumbComponent, DatePeriodComponent, PaginationComponent, SortComponent} from '../components';
import {DateAdapter, MAT_DATE_FORMATS, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {NumbersOnlyDirective, PhoneOnlyDirective, CustomDateAdapter, AnalysisOnlyDirective} from '../directives';
import {LabelPipe} from '../utils';
import {ErrorComponent} from './error/error.component';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
  },
  display: {
    dateInput: 'input',
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  exports: [
    LabelPipe,
    LocalizePipe,
    BreadcrumbComponent,
    PaginationComponent,
    SortComponent,
    ErrorComponent,
    DatePeriodComponent,
    NumbersOnlyDirective,
    PhoneOnlyDirective,
    AnalysisOnlyDirective,
  ],
  declarations: [
    LabelPipe,
    LocalizePipe,
    BreadcrumbComponent,
    PaginationComponent,
    SortComponent,
    ErrorComponent,
    DatePeriodComponent,
    NumbersOnlyDirective,
    PhoneOnlyDirective,
    AnalysisOnlyDirective,
  ],
  providers: [
    {
      provide: DateAdapter, useClass: CustomDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    }
  ],
})
export class SharedModule { }
