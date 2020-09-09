import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { Invoice } from '../../../models/invoice';
import { EventService } from '../../../services/event.service';


@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  invoiceList: Invoice[];
  itemsRef: any;
  constructor(private invoiceService: InvoiceService,
    private eventService: EventService) { }

  ngOnInit() {
    this.eventService.subscribe('addInvoice', (customer) => {
      this.invoiceList = this.invoiceService.getInvoices();
    })
    this.invoiceList = this.invoiceService.getInvoices();
  }

  onEdit(invoice: Invoice) {
    // this.invoiceService.selectedInvoice = Object.assign({},invoice);
  }

  onDelete(id: string) {
    // this.invoiceService.deleteInvoice(id);
  }
}

