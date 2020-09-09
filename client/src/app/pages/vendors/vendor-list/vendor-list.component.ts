import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Vendor } from '../../../../app/models/vendor';
import { VendorsService } from '../../../../app/services/vendors.service';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  vendorList: Vendor[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  vendorSearch: any;
  status: any = 1;
  constructor(private eventService: EventService,
    private vendorService: VendorsService,
    private tostr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.eventService.subscribe('addVendor', (vendor) => {
      // TODO - API call
      this.getVendorsList(this.status);
    });
    this.eventService.subscribe('updateVendor', (vendor) => {
      // TODO - API call
      this.getVendorsList(this.status);
    });
    this.getVendorsList(this.status);
  }
  onEdit(vendor: Vendor) {
    console.log(vendor);
    this.vendorService.selectedVendor = Object.assign({}, vendor);
  }
  onDelete(vendor: Vendor) {
    vendor.is_active = !vendor.is_active;
    // tslint:disable-next-line:no-string-literal
    delete vendor['vendor_id'];
    this.vendorService.deleteVendor(vendor).subscribe(ok => {
      if (!ok.error) {
        this.getVendorsList(this.status);
        this.tostr.success('Successs', 'vendor Deleted');
      }
    })
  }
  getVendorsList(status) {
    this.vendorService.getVendors(status).subscribe(data => {
      this.vendorList = data.results.data
      this.vendorList = data.results.data.filter(res => res.vendor_id = res.prefix + '' + res.id)
      this.dataSource = new MatTableDataSource<any>(this.vendorList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    })
  }
  statusChange(e) {
    this.getVendorsList(this.status);
  }
}
