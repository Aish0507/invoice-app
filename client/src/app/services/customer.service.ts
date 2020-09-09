import { Injectable } from '@angular/core';
import { Customer } from '../models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customerList: any = [];
  selectedCustomer: Customer = new Customer();
  constructor(private http: HttpClient) { }
  getCustomers(active?: any) {
    return this.getCustomerFromAPI(active);
  }
  insertCustomer(customer: Customer) {
    return this.http.post<any>(`${environment.apiUrl}/customer/create`, customer)
      .pipe(map(data => {
        if (!data.error) {
          this.customerList.push({
            id: data.results.data.id,
            f_name: data.results.data.f_name,
            l_name: data.results.data.l_name,
            mobile_no: data.results.data.mobile_no,
            address: data.results.data.address,
            is_active: 1
          });
        } else {
          console.log(data);
        }
        return data;
      }));
  }

  updateCustomer(customer: Customer) {
    return this.http.post<any>(`${environment.apiUrl}/customer/update`, customer)
      .pipe(map(data => {
        return data;
      }))
  }

  deleteCustomer(customer: Customer) {
    return this.http.post<any>(`${environment.apiUrl}/customer/soft-delete`, customer)
      .pipe(map(data => {
        return data;
      }))
  }
  getCustomerFromAPI(active: any = 1) {
    return this.http.get<any>(`${environment.apiUrl}/customer/list?active=${active}`)
      .pipe(map(res => {
        this.customerList = res.results.data
        return res;
      }));
  }
}
