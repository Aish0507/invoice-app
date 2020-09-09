import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { EventService } from '../../../services/event.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryList: Category[];
  constructor(private categoryService: CategoryService,
    private eventService: EventService) { }

  ngOnInit(): void {
  }
  onSubmit(categoryForm: NgForm) {
    if (categoryForm.value.id == null) {
      this.eventService.broadcast('addCategory', categoryForm.value);
      this.categoryService.insertCategory(categoryForm.value);
    }
    else {
      this.eventService.broadcast('updateCategory', categoryForm.value);
      // this.categoryService.insertCategory(categoryForm.value);
    }
    this.resetForm(categoryForm);
  }

  resetForm(categoryForm?: NgForm) {
    if (categoryForm != null) {
      categoryForm.reset();
    }
  }

}
