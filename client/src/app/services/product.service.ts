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

  }
  deleteProduct(id: string) {
    this.productList = this.productList.filter(data => data.id !== id);
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
  getProductWarrantyFromAPI() {
    return this.http.get<any>(`${environment.apiUrl}/product/warranty`)
      .pipe(map(res => {
        this.productList = res.results.data
        return res;
      }));
  }

}
