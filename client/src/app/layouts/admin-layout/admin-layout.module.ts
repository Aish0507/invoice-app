import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesComponent } from '../../pages/categories/categories.component';
import { CategoryComponent } from '../../pages/categories/category/category.component';
import { CategoryListComponent } from '../../pages/categories/category-list/category-list.component';
import { ProductsComponent } from '../../pages/products/products.component';
import { ProductComponent } from '../../pages/products/product/product.component';
import { ProductListComponent } from '../../pages/products/product-list/product-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
  ],
  declarations: [
    DashboardComponent,
    CategoriesComponent,
    CategoryComponent,
    CategoryListComponent,
    ProductsComponent,
    ProductComponent,
    ProductListComponent
  ]
})
export class AdminLayoutModule { }
