import { Injectable } from '@angular/core';
import { Vendor } from '../models/vendor';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  vendorList: Vendor[] = [];
  selectedVendor: Vendor = new Vendor();
  constructor(private http: HttpClient) { }
  insertVendor(vendor: Vendor) {
    return this.http.post<any>(`${environment.apiUrl}/vendor/create`, vendor)
      .pipe(map(data => {
        if (!data.error) {
          this.vendorList.push({
            id: data.results.data.id,
            name: data.results.data.name,
            address: data.results.data.address,
            mobile_no: data.results.data.mobile_no,
            is_active: 1
          });
        } else {
          console.log(data);
        }
        return data;
      }));
  }

  updateVendor(vendor: Vendor) {
    return this.http.post<any>(`${environment.apiUrl}/vendor/update`, vendor)
      .pipe(map(data => {
        console.log({ data });
        return data;
      }))
  }

  deleteVendor(vendor: Vendor) {
    return this.http.post<any>(`${environment.apiUrl}/vendor/soft-delete`, vendor)
      .pipe(map(data => {
        console.log({ data });
        return data;
      }))
  }
  getVendors(active?: any) {
    return this.getVendorsFromAPI(active); // TODO - API Call
  }
  getVendorsFromAPI(active: any = 1) {
    return this.http.get<any>(`${environment.apiUrl}/vendor/list?active=${active}`)
      .pipe(map(res => {
        this.vendorList = res.results.data
        return res;
      }));
  }

}
