import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  productList: Product[];
  productSearch: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  constructor(private eventService: EventService,
    private productService: ProductService,
    private tostr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.eventService.subscribe('addProduct', (category) => {
      this.productService.getProducts().subscribe((data: any) => {
        this.productList = data.results.data
        this.dataSource = new MatTableDataSource<any>(this.productList);
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      });
    });
    this.eventService.subscribe('uploadProduct', (category) => {
      this.productService.getProducts().subscribe((data: any) => {
        this.productList = data.results.data
        this.dataSource = new MatTableDataSource<any>(this.productList);
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      });
    });
    this.eventService.subscribe('updateProduct', (category) => {
      // this.productList = this.productService.getProducts();
      this.productList = this.productList.filter(data => {
        if (data.$key === category.$key) {
          data.name = category.name;
          data.location = category.location;
          data.price = category.price;
          data.categoryS = category.categoryS;
        }
        return data;
      })
    });
    this.productService.getProducts().subscribe(data => {
      this.productList = data.results.data
      this.dataSource = new MatTableDataSource<any>(this.productList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    });
  }
  onEdit(product: Product) {
    this.productService.selectedProduct = Object.assign({}, product);
  }
  onDelete($key: string) {
    this.productList = this.productList.filter(data => data.$key !== $key);
    this.productService.deleteProduct($key);
    this.eventService.broadcast('deleteProduct', $key);
    this.tostr.success('Successs', 'Product Deleted');
  }
  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

}
