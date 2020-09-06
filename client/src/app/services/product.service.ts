import { Injectable } from '@angular/core';
import { Product } from '../models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productList: Product[] = [];
  selectedProduct: Product = new Product();
  constructor(private http: HttpClient) { }
  getProducts() {
    return this.getProductFromAPI()
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
  uploadProductFromFile(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/upload-product/upload-bulk`, { data })
      .pipe(map(res => {
        console.log(res);
        return res;
      }));
  }
  getProductFromAPI() {
    return this.http.get<any>(`${environment.apiUrl}/product/list`)
      .pipe(map(res => {
        this.productList = res.results.data
        return res;
      }));
  }
}
