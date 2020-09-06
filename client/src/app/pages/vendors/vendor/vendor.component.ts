import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vendor } from '../../../models/vendor';
import { VendorsService } from '../../../services/vendors.service';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  vendorList: Vendor[];
  constructor(private vendorService: VendorsService,
    private eventService: EventService) { }

  ngOnInit(): void {
  }
  onSubmit(vendorForm: NgForm) {
    if (vendorForm.value.$key == null) {
      this.eventService.broadcast('addVendor', vendorForm.value);
      this.vendorService.insertVendor(vendorForm.value);
    }
    else {
      this.eventService.broadcast('updateVendor', vendorForm.value);
      // this.vendorService.insertVendor(vendorForm.value);
    }
    this.resetForm(vendorForm);
  }

  resetForm(vendorForm?: NgForm) {
    if (vendorForm != null) {
      vendorForm.reset();
    }
  }


}
