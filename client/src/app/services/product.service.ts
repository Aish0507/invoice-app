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
  getProducts(status?: any) {
    return this.getProductFromAPI(status)
  }
  insertProduct(product: Product) {
    return this.http.post<any>(`${environment.apiUrl}/product/create`, product)
      .pipe(map(data => {
        if (!data.error) {
          console.log(data);
        } else {
          console.log(data);
        }
        return data;
      }));
  }
  deleteProduct(product: Product) {
    console.log(product);
    return this.http.post<any>(`${environment.apiUrl}/product/soft-delete`, product)
      .pipe(map(data => {
        console.log({ data });
        return data;
      }))
  }
  updateProduct(product: Product) {
    return this.http.post<any>(`${environment.apiUrl}/product/update`, product)
      .pipe(map(data => {
        console.log({ data });
        return data;
      }))
  }
  uploadProductFromFile(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/upload-product/upload-bulk`, { data })
      .pipe(map(res => {
        console.log(res);
        return res;
      }));
  }
  getProductFromAPI(status?: any) {
    return this.http.get<any>(`${environment.apiUrl}/product/list?active=${status}`)
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
  getProductHistAPI(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/product-history/list?id=${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
  updateProductCnt(data: any) {
    const dataSet = (data.purchases);
    return this.http.post<any>(`${environment.apiUrl}/product/update-prd-cnt`, dataSet)
      .pipe(map(res => {
        console.log(res);
        return res;
      }));
  }
}
