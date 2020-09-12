import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Customer } from '../../../models';
import { CustomerService } from '../../../services/customer.service';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  customerList: Customer[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  customerSearch: any;
  status: any = 1;
  constructor(public customerService: CustomerService,
    private eventService: EventService,
    private tostr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.eventService.subscribe('addCustomer', (customer) => {
      this.getCustomerList(this.status);
    })
    this.eventService.subscribe('updateCustomer', (customer) => {
      this.getCustomerList(this.status);
    })
    this.getCustomerList(this.status);
  }
  onEdit(customer: Customer) {
    this.customerService.selectedCustomer = Object.assign({}, customer);
  }

  onDelete(customer: Customer) {
    console.log(customer);
    customer.is_active = !customer.is_active;
    this.customerService.deleteCustomer(customer).subscribe(ok => {
      if (!ok.error) {
        this.getCustomerList(this.status);
        this.tostr.success('Successs', 'Category Deleted');
      }
    })
  }
  getCustomerList(status) {
    this.customerService.getCustomers(status).subscribe(data => {
      this.customerList = data.results.data
      this.dataSource = new MatTableDataSource<any>(this.customerList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    })
  }
  statusChange(e) {
    this.getCustomerList(this.status);
  }
  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

}
