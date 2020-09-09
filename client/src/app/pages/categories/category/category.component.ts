import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryList: Category[];
  constructor(private categoryService: CategoryService,
    private eventService: EventService,
    private tostr: ToastrService) { }

  ngOnInit(): void {
  }
  onSubmit(categoryForm: NgForm) {
    if (categoryForm.value && categoryForm.value.id == null || categoryForm.value.id === undefined) {
      this.categoryService.insertCategory(categoryForm.value).subscribe(ok => {
        if (!ok.error) {
          this.eventService.broadcast('addCategory', categoryForm.value);
        } else {
          this.tostr.error('Error', 'Fail');
        }
      }, err => {
        this.tostr.error('Error', 'Fail- Add all data')
      },
        () => {
          this.tostr.success('Successs', 'Vendor Registered');
        });
    }
    else {
      if (categoryForm.value) {
        this.categoryService.updateCategory(categoryForm.value).subscribe(ok => {
          if (!ok.error) {
            this.eventService.broadcast('updateCategory', categoryForm.value);
          }
        })
      }
    }
    this.resetForm(categoryForm);
  }

  resetForm(categoryForm?: NgForm) {
    if (categoryForm != null) {
      categoryForm.reset();
    }
  }

}
