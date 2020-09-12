import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Category } from '../../../models/category';
import { EventService } from '../../../services/event.service';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categoryList: Category[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  categorySearch: any;
  status: any = 1;
  constructor(private eventService: EventService,
    public categoryService: CategoryService,
    private tostr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.eventService.subscribe('addCategory', (category) => {
      this.getCategoryList(this.status);
    });
    this.eventService.subscribe('updateCategory', (category) => {
      this.getCategoryList(this.status);
    });
    this.getCategoryList(this.status);
  }
  onEdit(category: Category) {
    this.categoryService.selectedCategory = Object.assign({}, category);
  }

  onDelete(category: Category) {
    category.is_active = !category.is_active;
    this.categoryService.deleteCategory(category).subscribe(ok => {
      if (!ok.error) {
        this.getCategoryList(this.status);
        this.tostr.success('Successs', 'Category Deleted');
      }
    })
  }
  getCategoryList(status) {
    this.categoryService.getCategories(status).subscribe(data => {
      this.categoryList = data.results.data
      this.dataSource = new MatTableDataSource<any>(this.categoryList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    })
  }
  statusChange(e) {
    this.getCategoryList(this.status);
  }
}
