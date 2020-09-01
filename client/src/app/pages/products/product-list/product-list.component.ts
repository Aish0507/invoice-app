import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productList: Product[];
  productSearch: any;
  constructor(private eventService: EventService,
    private productService: ProductService,
    private tostr: ToastrService) { }

  ngOnInit(): void {
    this.eventService.subscribe('addProduct', (category) => {
      this.productList = this.productService.getProducts();
    });
    this.eventService.subscribe('updateProduct', (category) => {
      // this.productList = this.productService.getProducts();
      this.productList = this.productList.filter(data => {
        if (data.$key === category.$key) {
          data.name = category.name;
          data.location = category.location;
          data.price = category.price;
          data.categoryS = category.categoryS;
        }
        return data;
      })
    });
  }
  onEdit(product: Product) {
    this.productService.selectedProduct = Object.assign({}, product);
  }
  onDelete($key: string) {
    this.productList = this.productList.filter(data => data.$key !== $key);
    this.productService.deleteProduct($key);
    this.eventService.broadcast('deleteProduct', $key);
    this.tostr.success('Successs', 'Product Deleted');
  }

}
