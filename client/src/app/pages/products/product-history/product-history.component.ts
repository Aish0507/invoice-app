import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../../app/models';

@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html',
  styleUrls: ['./product-history.component.scss']
})
export class ProductHistoryComponent implements OnInit {
  productHistList: Product[];
  constructor(public productService: ProductService) { }
  @Input() modalData: any;

  ngOnInit(): void {
    this.productService.getProductHistAPI(this.modalData).subscribe((data: any) => {
      this.productHistList = data.results.data
    });
  }
}
