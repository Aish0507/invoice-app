import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryList: Category[] = [];
  selectedCategory: Category = new Category();
  constructor(private http: HttpClient) { }
  insertCategory(category: Category) {
    return this.http.post<any>(`${environment.apiUrl}/category/create`, category)
      .pipe(map(data => {
        if (!data.error) {
          this.categoryList.push({
            name: data.results.data.name,
            description: data.results.data.description,
            is_active: 1,
            id: data.results.data.id,
          });
        } else {
          console.log(data);
        }
        return data;
      }));
  }

  updateCategory(category: Category) {
    return this.http.post<any>(`${environment.apiUrl}/category/update`, category)
      .pipe(map(data => {
        console.log({ data });
        return data;
      }))
  }

  deleteCategory(category: Category) {
    return this.http.post<any>(`${environment.apiUrl}/category/soft-delete`, category)
      .pipe(map(data => {
        console.log({ data });
        return data;
      }))
  }
  getCategories(active?: any) {
    return this.getCategoriesFromAPI(active); // TODO - API Call
  }
  getCategoriesFromAPI(active: any = 1) {
    return this.http.get<any>(`${environment.apiUrl}/category/list?active=${active}`)
      .pipe(map(res => {
        this.categoryList = res.results.data
        return res;
      }));
  }

}
