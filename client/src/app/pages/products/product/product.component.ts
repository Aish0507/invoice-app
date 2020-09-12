import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { Modal } from '@crystalui/angular-modal';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { NgForm } from '@angular/forms';
import { Product } from '../../../models/product';
import { EventService } from '../../../services/event.service';
import { CategoryComponent } from '../../categories/category/category.component';
import { InvoiceModalService } from 'projects/invoice-modal/src/public-api';
import { VendorsService } from '../../../services/vendors.service';
import { Vendor } from '../../../models/vendor';
import { VendorComponent } from '../../vendors/vendor/vendor.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public selectUndefinedOptionValue: any;
  categoryList: Category[];
  warrantyList: any;
  vendorList: Vendor[];
  constructor(public productService: ProductService,
    public categoryService: CategoryService,
    private eventService: EventService,
    private modal: InvoiceModalService,
    public vendorService: VendorsService,
    private tostr: ToastrService) { }

  ngOnInit(): void {
    this.resetForm();
    this.categoryService.getCategories(status).subscribe(data => {
      this.categoryList = data.results.data
    })
    this.productService.getProductWarrantyFromAPI().subscribe(data => {
      this.warrantyList = data.results.data
    })
    this.vendorService.getVendors(status).subscribe(data => {
      this.vendorList = data.results.data
    })
  }
  resetForm(productForm?: NgForm) {
    if (productForm != null)
      productForm.reset();
    this.productService.selectedProduct = new Product();
  }
  categoryModal() {
    this.modal.load({
      id: 'my-modal',
      component: CategoryComponent
    });
  }
  vendorModal() {
    this.modal.load({
      id: 'my-modal',
      component: VendorComponent
    });
  }
  onSubmit(productForm: NgForm) {
    if (productForm.value && productForm.value.id == null || productForm.value.id === undefined) {
      this.productService.insertProduct(productForm.value).subscribe(ok => {
        if (!ok.error) {
          this.eventService.broadcast('addProduct', productForm.value);
        } else {
          this.tostr.error('Error', 'Fail');
        }
      }, err => {
        this.tostr.error('Error', 'Fail- Add all data')
      },
        () => {
          this.tostr.success('Successs', 'Product Registered');
        })
    } else {
      if (productForm.value) {
        this.productService.updateProduct(productForm.value).subscribe(ok => {
          if (!ok.error) {
            this.eventService.broadcast('updateProduct', productForm.value);
          }
        })
      }
    }
    this.resetForm(productForm);
  }
}
