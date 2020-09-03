import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../models';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productList: Product[] = [];
  constructor(private productService: ProductService,
    private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.subscribe('deleteProduct', (category) => {
      this.productList = this.productService.getProducts();
    });
    this.productList = this.productService.getProducts();
  }

}
