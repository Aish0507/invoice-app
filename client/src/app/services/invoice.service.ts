import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IInvoice, Invoice } from '../models/invoice';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceList: any;
  constructor(private http: HttpClient) {
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
  getInvoicesListFromAPI() {
    return this.http.get<any>(`${environment.apiUrl}/sale/list`)
      .pipe(map(res => {
        return res;
      }));
  }
}
