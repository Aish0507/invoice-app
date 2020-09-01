import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../models';
import { CustomerService } from '../../../services/customer.service';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  customerList: Customer[];

  constructor(private customerService: CustomerService,
    private eventService: EventService,
    private tostr: ToastrService) { }


  ngOnInit(): void {
    this.eventService.subscribe('addCustomer', (customer) => {
      this.customerList = this.customerService.getCustomers();
    })
    this.eventService.subscribe('updateCustomer', (customer) => {
      this.customerList = this.customerList.filter(data => {
        if (data.$key === customer.$key) {
          data.name = customer.name;
          data.lastname = customer.lastname;
          data.address = customer.address;
          data.phone = customer.phone;
        }
        return data;
      })
    })
  }
  onEdit(customer: Customer) {
    this.customerService.selectedCustomer = Object.assign({}, customer);
  }

  onDelete($key: string) {
    this.customerList = this.customerList.filter(data => data.$key !== $key);
  }

}
