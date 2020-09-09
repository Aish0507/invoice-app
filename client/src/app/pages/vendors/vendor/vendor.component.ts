import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vendor } from '../../../models/vendor';
import { VendorsService } from '../../../services/vendors.service';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  vendorList: Vendor[];
  constructor(private vendorService: VendorsService,
    private eventService: EventService,
    private tostr: ToastrService) { }

  ngOnInit(): void {
  }
  onSubmit(vendorForm: NgForm) {
    if (vendorForm.value && vendorForm.value.id == null || vendorForm.value.id === undefined) {
      this.vendorService.insertVendor(vendorForm.value).subscribe(ok => {
        console.log(ok);
        if (!ok.error) {
          this.eventService.broadcast('addVendor', vendorForm.value);
        } else {
          this.tostr.error('Error', 'Fail');
        }
      },
        err => {
          this.tostr.error('Error', 'Fail- Add all data')
        },
        () => {
          this.tostr.success('Successs', 'Vendor Registered');
        })
    }
    else {
      if (vendorForm.value) {
        this.vendorService.updateVendor(vendorForm.value).subscribe(ok => {
          console.log(ok);
          if (!ok.error) {
            this.eventService.broadcast('updateVendor', vendorForm.value);
          }
        });
      }
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
