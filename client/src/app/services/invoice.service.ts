import { Injectable } from '@angular/core';
import { IInvoice, Invoice } from '../models/invoice';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceList: any;
  constructor() {
    this.invoiceList = [];
  }
  getInvoices() {
    return this.invoiceList;
  }
  insertInvoice(invoice: IInvoice) {
    invoice.createdAt = new Date().toString();
    invoice.uid = '123'
    this.invoiceList.push(invoice);
  }

  updateInvoice(invoice: Invoice) {
  }

  deleteInvoice(id: string) {
  }
}
