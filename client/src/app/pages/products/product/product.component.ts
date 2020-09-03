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

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  private selectUndefinedOptionValue: any;
  categoryList: Category[];
  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private eventService: EventService,
    private modal: InvoiceModalService) { }

  ngOnInit(): void {
    this.resetForm();
    this.categoryList = this.categoryService.getCategories();
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
  onSubmit(productForm: NgForm) {
    if (productForm.value.$key == null) {
      this.eventService.broadcast('addProduct', productForm.value);
      this.productService.insertProduct(productForm.value);
    } else {
      this.eventService.broadcast('updateProduct', productForm.value);
      //  this.productService.insertProduct(productForm.value);
    }
    this.resetForm(productForm);
  }
}
