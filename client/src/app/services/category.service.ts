import { Injectable } from '@angular/core';
import { Category } from '../models/category';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryList: Category[] = [];
  selectedCategory: Category = new Category();
  constructor() { }
  insertCategory(category: Category) {
    this.categoryList.push({
      id: Math.floor(Math.random() * 101),
      name: category.name,
      description: category.description
    });
  }

  updateCategory(category: Category) {
  }

  deleteCategory(id: string) {
  }
  getCategories() {
    return this.categoryList; // TODO - API Call
  }

}
