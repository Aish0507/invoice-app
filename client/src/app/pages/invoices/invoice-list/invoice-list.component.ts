import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { Invoice } from '../../../models/invoice';
import { EventService } from '../../../services/event.service';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  constructor(private invoiceService: InvoiceService,
    private eventService: EventService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.invoiceService.getInvoicesListFromAPI().subscribe(ok => {
      this.invoiceList = ok.results.data;
      this.invoiceList = this.invoiceList.filter(data => {
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

  onEdit(invoice: Invoice) {
    // this.invoiceService.selectedInvoice = Object.assign({},invoice);
  }

  onDelete(id: string) {
    // this.invoiceService.deleteInvoice(id);
  }
}

