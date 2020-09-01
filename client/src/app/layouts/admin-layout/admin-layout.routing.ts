import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CategoriesComponent } from '../../pages/categories/categories.component';
import { ProductsComponent } from '../../pages/products/products.component';
import { CustomersComponent } from 'src/app/pages/customers/customers.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'product', component: ProductsComponent },
  { path: 'customers', component: CustomersComponent },
];
