import { Injectable } from '@angular/core';
import { Vendor } from '../models/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  vendorList: Vendor[] = [];
  selectedVendor: Vendor = new Vendor();
  constructor() { }
  insertVendor(vendor: Vendor) {
    this.vendorList.push({
      $key: Math.floor(Math.random() * 101),
      name: vendor.name,
      description: vendor.description
    });
  }

  updateVendor(vendor: Vendor) {
  }

  deleteVendor($key: string) {
  }
  getVendors() {
    return this.vendorList; // TODO - API Call
  }
}
