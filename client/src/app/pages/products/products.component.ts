import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../models';
import { EventService } from '../../services/event.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productList: Product[] = [];
  file: any
  arrayBuffer: any;
  filelist: any[];
  constructor(public productService: ProductService,
    private eventService: EventService,
    private tostr: ToastrService) { }

  ngOnInit(): void {
    this.eventService.subscribe('deleteProduct', (category) => {
      this.productService.getProducts(1).subscribe((data: any) => {
        this.productList = data.results.data
      });
    });
    this.productService.getProducts(1).subscribe((data: any) => {
      this.productList = data.results.data
    });
  }
  addfile(event: any) {
    this.file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      // tslint:disable-next-line:prefer-const
      let data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      // tslint:disable-next-line:prefer-const
      let bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line:variable-name
      const firstSheetName = workbook.SheetNames[0];
      // tslint:disable-next-line:prefer-const
      let worksheet = workbook.Sheets[firstSheetName];
      // tslint:disable-next-line:prefer-const
      const arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.productService.uploadProductFromFile(arraylist).subscribe(uploadData => {
        console.log({ uploadData })
        if (!uploadData.error) {
          this.eventService.broadcast('uploadProduct', uploadData.results.data);
          this.tostr.success('Successs', 'Product Uploaded Done');
        }
      })
    }
  }

}
