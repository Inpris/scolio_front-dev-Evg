import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ContactSearchComponent } from './contact-search.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
  ],
  declarations: [ContactSearchComponent],
  exports: [ContactSearchComponent],
})
export class ContactSearchModule {
}
