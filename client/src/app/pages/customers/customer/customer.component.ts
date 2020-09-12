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
  constructor(public customerService: CustomerService,
    private tostr: ToastrService,
    private eventService: EventService) { }

  ngOnInit(): void {
  }
  onSubmit(customerForm: NgForm) {
    if (customerForm.value && customerForm.value.id == null || customerForm.value.id === undefined) {
      this.customerService.insertCustomer(customerForm.value).subscribe(ok => {
        if (!ok.error) {
          this.eventService.broadcast('addCustomer', customerForm.value);
        } else {
          this.tostr.error('Error', 'Fail');
        }
      }, err => {
        this.tostr.error('Error', 'Fail- Add all data')
      },
        () => {
          this.tostr.success('Submitted Successfully', 'Customer Register');
        })
    } else {
      if (customerForm.value) {
        this.customerService.updateCustomer(customerForm.value).subscribe(ok => {
          if (!ok.error) {
            this.eventService.broadcast('updateCustomer', customerForm.value);
          }
        })
      }
    }
    this.resetForm(customerForm);
  }

  resetForm(customerForm?: NgForm) {
    if (customerForm != null) {
      customerForm.reset();
    }
    // this.customerService.selectedCustomer = new Customer();
  }

}
