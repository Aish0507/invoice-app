import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Vendor } from '../../../../app/models/vendor';
import { VendorsService } from '../../../../app/services/vendors.service';
@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  vendorList: Vendor[] = [];

  constructor(private eventService: EventService,
    private vendorService: VendorsService,
    private tostr: ToastrService) { }

  ngOnInit(): void {
    this.eventService.subscribe('addCategory', (vendor) => {
      // TODO - API call
      this.vendorList = this.vendorService.getVendors();
    });
    this.eventService.subscribe('updateCategory', (vendor) => {
      // TODO - API call
      this.vendorList = this.vendorList.filter(data => {
        if (data.$key === vendor.$key) {
          data.name = vendor.name;
          data.description = vendor.description;
        }
        return data;
      })
      // this.vendorList = this.vendorService.getCategories();
    });
    this.vendorList = this.vendorService.getVendors();
  }
  onEdit(vendor: Vendor) {
    this.vendorService.selectedVendor = Object.assign({}, vendor);
  }

  onDelete($key: string) {
    this.vendorList = this.vendorList.filter(data => data.$key !== $key);
    this.tostr.success('Successs', 'vendor Deleted');
  }

}
