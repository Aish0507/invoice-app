import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { Invoice } from '../../../models/invoice';
import { EventService } from '../../../services/event.service';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceModalService } from 'projects/invoice-modal/src/public-api';
import { InvoiceConfirmationComponent } from '../invoice-confirmation/invoice-confirmation.component';
import { Hotkeys } from '../../../services/hotkeys.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  invoiceList: Invoice[];
  itemsRef: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  invoiceSearch: any;
  withGst: boolean;
  constructor(private invoiceService: InvoiceService,
    private eventService: EventService,
    private changeDetectorRef: ChangeDetectorRef,
    private modal: InvoiceModalService,
    private hotkeys: Hotkeys) {
    this.withGst = true;
    hotkeys.addShortcut({ keys: 'shift.g' }).subscribe(ok => {
      this.withGst = !this.withGst;
      this.getInvoiceList();
    })
  }
  jsonEscape(str) {
    return str.replace(/\n/g, '\\\\n').replace(/\r/g, '\\\\r').replace(/\t/g, '\\\\t');
  }
  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.getInvoiceList();
  }

  onEdit(invoice: Invoice) {
    // this.invoiceService.selectedInvoice = Object.assign({},invoice);
  }

  onDelete(id: string) {
    // this.invoiceService.deleteInvoice(id);
  }
  viewInvoice(invoice: any) {
    this.modal.load({
      id: 'p-history',
      component: InvoiceConfirmationComponent,
      mode: 'mobile',
      modalClass: 'p-history',
      data: invoice.sale_info,
      title: {
        id: invoice.invoice_id, date: invoice.time_paid
      }
    });
  }
  getInvoiceList() {
    this.invoiceService.getInvoicesListFromAPI(this.withGst).subscribe(ok => {
      this.invoiceList = ok.results.data;
      this.invoiceList = this.invoiceList.filter(data => {

        data.sale_info = ((JSON.parse(this.jsonEscape(data.sale_info))));
        // console.log()
        // data.sale_info = ((JSON.stringify(data.sale_info)));
        // // tslint:disable-next-line:no-eval
        // console.log(typeof JSON.parse(eval(data.sale_info)));
        return data;
      })
      this.dataSource = new MatTableDataSource<any>(this.invoiceList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    });
  }
}

