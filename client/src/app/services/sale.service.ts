import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  salesList: any
  constructor(private http: HttpClient) { }
  insertSale(sale: any) {
    return this.http.post<any>(`${environment.apiUrl}/sale/create`, sale)
      .pipe(map(data => {
        if (!data.error) {
          console.log(data)
        } else {
          console.log(data);
        }
        return data;
      }));
  }
  getSales() {
    return this.getSalesFromAPI();
  }
  getSalesFromAPI() {
    return this.http.get<any>(`${environment.apiUrl}/sale/list`)
      .pipe(map(res => {
        return res;
      }));
  }
}
