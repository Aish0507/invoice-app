import { NgModule } from '@angular/core';
import { InvoiceModalComponent } from './invoice-modal.component';
import { AdDirective } from './ad.directive';
import { InvoiceModalService } from './invoice-modal.service';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    InvoiceModalComponent,
    AdDirective],
  imports: [
    CommonModule
  ],
  exports: [InvoiceModalComponent],
  providers: [InvoiceModalService],
  entryComponents: [
    InvoiceModalComponent
  ]
})
export class InvoiceModalModule { }
