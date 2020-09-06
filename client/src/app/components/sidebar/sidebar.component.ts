import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'icon-chart-pie-36',
    class: ' '
  },
  {
    path: '/invoices',
    title: 'Invoices',
    icon: 'icon-align-center',
    class: ' '
  },
  {
    path: '/invoices-list',
    title: 'Invoice List',
    icon: 'icon-align-center',
    class: ' '
  },
  {
    path: '/product',
    title: 'Product',
    icon: 'icon-world',
    class: ' '
  },
  {
    path: '/customers',
    title: 'customers',
    icon: 'icon-single-02',
    class: ' '
  },
  {
    path: '/categories',
    title: 'Categories',
    icon: 'icon-single-02',
    class: ' '
  },
  {
    path: '/vendors',
    title: 'Vendors',
    icon: 'icon-single-02',
    class: ' '
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
