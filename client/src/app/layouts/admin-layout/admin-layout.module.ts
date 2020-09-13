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
import { VendorsComponent } from '../../pages/vendors/vendors.component';
import { VendorComponent } from '../../pages/vendors/vendor/vendor.component';
import { VendorListComponent } from '../../pages/vendors/vendor-list/vendor-list.component';
import { HelipopperModule } from '@ngneat/helipopper';
import { ProductHistoryComponent } from '../../pages/products/product-history/product-history.component';
import { InvoiceConfirmationComponent } from '../../pages/invoices/invoice-confirmation/invoice-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    InvoiceModalModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    HelipopperModule.forRoot(),
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
    SearchPipe,
    VendorsComponent,
    VendorComponent,
    VendorListComponent,
    ProductHistoryComponent,
    InvoiceConfirmationComponent
  ],
  entryComponents: [
    ProductComponent,
    CategoryComponent
  ]
})
export class AdminLayoutModule { }
