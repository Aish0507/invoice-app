import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesComponent } from '../../pages/categories/categories.component';
import { CategoryComponent } from '../../pages/categories/category/category.component';
import { CategoryListComponent } from '../../pages/categories/category-list/category-list.component';
import { ProductsComponent } from '../../pages/products/products.component';
import { ProductComponent } from '../../pages/products/product/product.component';
import { ProductListComponent } from '../../pages/products/product-list/product-list.component';
import { ModalModule } from '@crystalui/angular-modal';
import { InvoiceModalModule } from 'projects/invoice-modal/src/public-api';
import { CustomersComponent } from '../../pages/customers/customers.component';
import { CustomerComponent } from '../../pages/customers/customer/customer.component';
import { CustomerListComponent } from '../../pages/customers/customer-list/customer-list.component';
import { InvoiceComponent } from '../../pages/invoices/invoice/invoice.component';
import { InvoiceListComponent } from '../../pages/invoices/invoice-list/invoice-list.component';
import { InvoicesComponent } from '../../pages/invoices/invoices.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SearchPipe } from '../../helpers/search.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    InvoiceModalModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  declarations: [
    DashboardComponent,
    CategoriesComponent,
    CategoryComponent,
    CategoryListComponent,
    ProductsComponent,
    ProductComponent,
    ProductListComponent,
    CustomersComponent,
    CustomerComponent,
    CustomerListComponent,
    InvoicesComponent,
    InvoiceListComponent,
    InvoiceComponent,
    SearchPipe
  ],
  entryComponents: [
    ProductComponent,
    CategoryComponent
  ]
})
export class AdminLayoutModule { }
