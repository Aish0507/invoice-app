import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { EventService } from '../../../services/event.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categoryList: Category[] = [];

  constructor(private eventService: EventService,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.eventService.subscribe('addCategory', (category) => {
      // TODO - API call
      // this.categoryList.push({
      //   $key: (Math.floor((Math.random() * 100) + 1)),
      //   name: category.name,
      //   description: category.description
      // });
      this.categoryList = this.categoryService.getCategories();
    });
    this.eventService.subscribe('updateCategory', (category) => {
      // TODO - API call
      // this.categoryList = this.categoryList.filter(data => {
      //   if (data.$key === category.$key) {
      //     data.name = category.name;
      //     data.description = category.description;
      //   }
      //   return data;
      // })
      this.categoryList = this.categoryService.getCategories();
    });
    this.categoryList = this.categoryService.getCategories();
  }
  onEdit(category: Category) {
    this.categoryService.selectedCategory = Object.assign({}, category);
  }

  onDelete($key: string) {
    this.categoryList = this.categoryList.filter(data => data.$key !== $key);
  }
}
