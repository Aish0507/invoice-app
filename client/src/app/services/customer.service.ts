import { Injectable } from '@angular/core';
import { Customer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customerList: any = [];
  selectedCustomer: Customer = new Customer();
  constructor() { }
  getCustomers() {
    return this.customerList;
  }
  insertCustomer(customer: Customer) {
    this.customerList.push({
      $key: Math.floor(Math.random() * 101),
      name: customer.name,
      lastname: customer.lastname,
      phone: customer.phone,
      address: customer.address
    });
  }

  updateCustomer(customer: Customer) {
  }

  deleteCustomer($key: string) {
  }
}
