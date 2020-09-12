import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceModalService } from 'projects/invoice-modal/src/public-api';
import { ProductHistoryComponent } from '../product-history/product-history.component';

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
  status: any = 1;
  constructor(private eventService: EventService,
    public productService: ProductService,
    private tostr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private modal: InvoiceModalService) { }

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.eventService.subscribe('addProduct', (category) => {
      this.getProductFromAPI(this.status);
    });
    this.eventService.subscribe('uploadProduct', (category) => {
      this.getProductFromAPI(this.status);
    });
    this.eventService.subscribe('updateProduct', (category) => {
      this.getProductFromAPI(this.status);
    });
    this.getProductFromAPI(this.status);
  }
  onEdit(product: any) {
    const dataSet: any = {};
    dataSet.name = product.pName.replace(/^"|"$/g, '');
    dataSet.cat_id = product.cID;
    dataSet.id = product.pID;
    dataSet.p_model_no = product.p_model_no.replace(/^"|"$/g, '');
    dataSet.p_hsn_code = product.p_hsn_code.replace(/^"|"$/g, '');
    dataSet.p_color = product.p_color.replace(/^"|"$/g, '');
    dataSet.vendor_id = product.vID;
    dataSet.p_warranty = product.p_warranty.replace(/^"|"$/g, '');
    dataSet.p_mrp_price = product.p_mrp_price;
    dataSet.p_sale_price = product.p_sale_price;
    dataSet.gst_percentage = product.gst_percentage;
    dataSet.in_stock = product.in_stock;
    this.productService.selectedProduct = Object.assign({}, dataSet);
  }
  onDelete(product: Product) {
    const dataSet: any = {};
    product.active_for_sale = !product.active_for_sale;
    dataSet.active_for_sale = product.active_for_sale;
    dataSet.id = product.pID;
    this.productService.deleteProduct(dataSet).subscribe(ok => {
      if (!ok.error) {
        this.getProductFromAPI(this.status);
        this.tostr.success('Successs', 'Product Deleted');
      }
    })
  }
  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  getProductFromAPI(status: any) {
    this.productService.getProducts(status).subscribe((data: any) => {
      this.productList = data.results.data
      this.dataSource = new MatTableDataSource<any>(this.productList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    });
  }
  statusChange(e) {
    this.getProductFromAPI(this.status);
  }

  showHistory(product: Product) {
    this.modal.load({
      id: 'product-history',
      component: ProductHistoryComponent,
      data: product.pID,
      mode: 'mobile',
      modalClass: 'p-history'
    });
  }
}
