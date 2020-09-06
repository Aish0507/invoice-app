import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CategoriesComponent } from '../../pages/categories/categories.component';
import { ProductsComponent } from '../../pages/products/products.component';
import { CustomersComponent } from '../../pages/customers/customers.component';
import { InvoicesComponent } from '../../pages/invoices/invoices.component';
import { InvoiceListComponent } from '../../pages/invoices/invoice-list/invoice-list.component';
import { AuthGuard } from '../../auth.guard';
import { VendorsComponent } from '../../pages/vendors/vendors.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'categories', canActivate: [AuthGuard], component: CategoriesComponent },
  { path: 'product', canActivate: [AuthGuard], component: ProductsComponent },
  { path: 'customers', canActivate: [AuthGuard], component: CustomersComponent },
  { path: 'invoices', canActivate: [AuthGuard], component: InvoicesComponent },
  { path: 'invoices-list', canActivate: [AuthGuard], component: InvoiceListComponent },
  { path: 'vendors', canActivate: [AuthGuard], component: VendorsComponent },
];
