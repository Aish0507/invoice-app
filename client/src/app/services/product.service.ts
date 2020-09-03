import { Injectable } from '@angular/core';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productList: Product[] = [];
  selectedProduct: Product = new Product();
  constructor() { }
  getProducts() {
    return this.productList; // TODO - API call
  }
  insertProduct(product: Product) {
    this.productList.push({
      $key: (Math.floor((Math.random() * 100) + 1)),
      name: product.name,
      location: product.location,
      price: product.price,
      categoryS: product.categoryS
    });
  }
  deleteProduct($key: string) {
    this.productList = this.productList.filter(data => data.$key !== $key);
    console.log(this.productList);
  }
}
