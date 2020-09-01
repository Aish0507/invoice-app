import { Injectable } from '@angular/core';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productList: any = [];
  selectedProduct: Product = new Product();
  constructor() { }
  getProducts() {
    return this.productList; // TODO - API call
  }
  insertProduct(product: Product) {
    this.productList.push({
      name: product.name,
      location: product.location,
      price: product.price,
      categoryS: product.categoryS
    });
  }
}
