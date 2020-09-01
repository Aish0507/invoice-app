import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Customer } from '../../../models';
import { CustomerService } from '../../../services/customer.service';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerList: Customer[];
  constructor(private customerService: CustomerService,
    private tostr: ToastrService,
    private eventService: EventService) { }

  ngOnInit(): void {
    this.resetForm();
    this.customerList = this.customerService.getCustomers();
  }
  onSubmit(customerForm: NgForm) {
    if (customerForm.value.$key == null) {
      this.eventService.broadcast('addCustomer', customerForm.value);
      this.customerService.insertCustomer(customerForm.value);
    } else {
      this.eventService.broadcast('updateCustomer', customerForm.value);
      // this.customerService.updateCustomer(customerForm.value);
    }
    this.tostr.success('Submitted Successfully', 'Customer Register');
    this.resetForm(customerForm);
  }

  resetForm(customerForm?: NgForm) {
    if (customerForm != null) {
      customerForm.reset();
    }
    this.customerService.selectedCustomer = new Customer();
  }

}
