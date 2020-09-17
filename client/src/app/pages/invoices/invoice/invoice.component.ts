import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ICustomer, IInvoice, Invoice, Product, IProduct } from '../../../models';
import { ProductService } from '../../../services/product.service';

import { ToastrService } from 'ngx-toastr';
import { CustomerComponent } from '../../customers/customer/customer.component';
import { ProductComponent } from '../../products/product/product.component';
import { InvoiceModalService } from 'projects/invoice-modal/src/public-api';
import { EventService } from '../../../services/event.service';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceConfirmationComponent } from '../invoice-confirmation/invoice-confirmation.component';
import { SaleService } from '../../../services/sale.service';
import { Hotkeys } from '../../../services/hotkeys.service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  form: FormGroup;
  title = 'Add Invoice';
  phoneCustomer: any;
  addressCustomer: any;
  showDiv: true;
  customer: true;
  public selectUndefinedOptionValue: any;
  customerList: ICustomer[];
  productList: IProduct[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  productSearch: any;
  status: any = 1;
  withGst: boolean;
  constructor(
    private _fb: FormBuilder,
    private invoiceService: InvoiceService,
    public customerService: CustomerService,
    public productService: ProductService,
    private tostr: ToastrService,
    private modal: InvoiceModalService,
    private eventService: EventService,
    private sale: SaleService,
    private hotkeys: Hotkeys) {
    this.withGst = true;
    hotkeys.addShortcut({ keys: 'shift.+' }).subscribe(ok => {
      this.withGst = !this.withGst;
      if (!this.withGst) {
        this.form.controls['cgst'].setValue(0);
        this.form.controls['igst'].setValue(0);
        this.form.controls['sgst'].setValue(0);
        this.form.controls['totalPriceAfterGST'].setValue(0);
      }
      this.form.controls['with_gst'].setValue(this.withGst);
    });
  }

  ngOnInit() {
    this.initForm();
    this.eventService.subscribe('addCustomer', (customer) => {
      this.getCustomerList();
    })
    this.productService.getProducts(1).subscribe((data: any) => {
      this.getProductList(data)
    });
    this.eventService.subscribe('addProduct', (category) => {
      this.productService.getProducts(1).subscribe((data: any) => {
        this.getProductList(data)
      });
    });
    this.getCustomerList();
  }

  initForm(): void {
    this.form = this._fb.group({
      customer: [null, Validators.required],
      totalPrice: 0,
      purchases: this._fb.array([]),
      cgst: [null],
      sgst: [null],
      igst: [null],
      totalPriceAfterGST: 0,
      totalPriceAfterDiscount: 0,
      discount: 0,
      discountType: ['amount'],
      invoiceStatus: ['Pending'],
      with_gst: this.withGst
    });

    // initialize stream
    const myFormValueChanges$ = this.form.controls.purchases.valueChanges;
    // subscribe to the stream
    myFormValueChanges$.subscribe(purchases => this.updatePurchasesAmount(purchases));
  }

  updatePurchasesAmount(purchases: any) {
    // tslint:disable-next-line:no-angle-bracket-type-assertion
    const control = <FormArray>this.form.controls.purchases;
    let totalSum = 0;
    // tslint:disable-next-line:forin
    for (const i in purchases) {
      const amount = (purchases[i].quantity * purchases[i].product.p_sale_price);
      control.at(+i).get('amount').setValue(amount, { onlySelf: true, emitEvent: false });
      // update total price
      totalSum += amount;
    }
    this.form.get('totalPrice').setValue(totalSum);
  }

  purchaseForm(product?: Product): FormGroup {
    const numberPatern = '^[0-9.,]+$';
    return this._fb.group({
      product: [product, Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(numberPatern)]],
      amount: [{ value: 0, disabled: true }],
    });
  }

  money(value: number) {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
  }

  public addPurchase(product: Product): void {
    // tslint:disable-next-line:no-angle-bracket-type-assertion
    const control = <FormArray>this.form.controls.purchases;

    let add = true;
    for (const i in control.controls) {
      if (control.at(+i).get('product').value.pName === product.pName) {
        // control.controls[i].get('quantity').setValue(control.controls[i].controls.quantity.value + 1);
        control.at(+i).get('quantity').setValue(control.at(+i).get('quantity').value + 1);
        add = false;
      }
    }

    if (add) {
      control.push(this.purchaseForm(product));
      this.showDiv = add;
    }
  }

  private removePurchase(i: number): void {
    // tslint:disable-next-line:no-angle-bracket-type-assertion
    const control = <FormArray>this.form.controls.purchases;
    control.removeAt(i);
  }

  resetPurchase(): void {
    // tslint:disable-next-line:no-string-literal
    this.form.controls['totalPrice'].setValue(0);
    this.form.controls['cgst'].setValue(null);
    this.form.controls['igst'].setValue(null);
    this.form.controls['sgst'].setValue(null);
    this.form.controls['totalPriceAfterGST'].setValue(0);
    this.form.controls['totalPriceAfterDiscount'].setValue(0);
    this.form.controls['discount'].setValue(0);
    // this.form.controls['purchases'].setValue([]);
    // tslint:disable-next-line:no-string-literal
    const control = this.form.controls['purchases'] as FormArray;
    control.controls = [];
    control.setValue([]);
    // console.log(control);
    // this.form.reset();

  }

  saveProduct() {
    if (this.form.valid && this.form.controls.totalPrice.value > 0) {
      this.form.get('invoiceStatus').setValue('Paid');
      const dataSet: any = {}
      dataSet.sale_info = JSON.stringify(this.form.value);
      dataSet.with_gst = this.withGst;
      dataSet.user_id = JSON.parse(localStorage.getItem('currentUser')).id;
      this.sale.insertSale(dataSet).subscribe(ok => {
        console.log(ok);
        if (ok.error) {
          this.tostr.error('Error', 'Fail');
        } else {
          this.productService.updateProductCnt(this.form.value).subscribe(data => {
          })
          this.preViewBill(ok.results.data.id, ok.results.data.time_paid)
          this.tostr.success('Successs', 'Invoice Registered')
        }
      }, err => console.log,
        () => {
        })
      // const result: IInvoice = this.form.value as IInvoice;
      // // Do useful stuff with the gathered data
      // console.log(result);
      // this.invoiceService.insertInvoice(result);
      // this.phoneCustomer = '';
      // this.addressCustomer = '';
      // this.showDiv = null;

      // this.tostr.success('Successs', 'Invoice Registered');
      // this.eventService.broadcast('addInvoice', result);
      // this.initForm();

    } else {
      if (this.form.controls.totalPrice.value <= 0) {
        this.tostr.error('Error', 'Invoice not value');
      }
      else (this.tostr.error('Error', 'Invoice No Registered'));
    }
  }
  preViewBill(id?: any, date?: any) {
    this.modal.load({
      id: 'p-history',
      component: InvoiceConfirmationComponent,
      mode: 'mobile',
      modalClass: 'p-history',
      data: this.form.value,
      title: { id, date }

    });
  }

  customerModal() {
    this.modal.load({
      id: 'my-modal',
      component: CustomerComponent
    });
  }

  productModal() {
    this.modal.load({
      id: 'my-modal',
      component: ProductComponent
    });
  }

  getSelectedOptionText(event) {
    this.resetPurchase();
    this.showDiv = null;
    this.phoneCustomer = event.mobile_no;
    this.addressCustomer = event.address;
  }
  getCustomerList() {
    this.customerService.getCustomers(1).subscribe(data => {
      this.customerList = data.results.data
    })
  }
  getProductList(data: any) {
    this.productList = data.results.data
    this.dataSource = new MatTableDataSource<any>(this.productList);
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }
  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  calculateGst() {
    // this.form.get('totalPriceAfterGST').setValue(this.form.controls.totalPriceAfterDiscount.value);
    if ((this.form.controls.cgst.value && this.form.controls.sgst.value) || this.form.controls.igst.value) {
      let cgstAndsgst = this.form.controls.cgst.value + this.form.controls.sgst.value;
      if (this.form.controls.igst.value) {
        cgstAndsgst = this.form.controls.igst.value;
      }
      this.form.get('totalPriceAfterGST').setValue((this.form.controls.totalPriceAfterDiscount.value
        * cgstAndsgst / 100) + this.form.controls.totalPriceAfterDiscount.value);
      return this.money((this.form.controls.totalPriceAfterDiscount.value * cgstAndsgst / 100)
        + this.form.controls.totalPriceAfterDiscount.value);
    }
  }
  calculateDiscount() {
    this.form.get('totalPriceAfterDiscount').setValue(this.form.controls.totalPrice.value)
    if (this.form.controls.discount.value) {
      if (this.form.controls.discountType.value === 'amount') {
        this.form.get('totalPriceAfterDiscount').setValue(this.form.controls.totalPrice.value - this.form.controls.discount.value)
      } else {
        this.form.get('totalPriceAfterDiscount').setValue(this.form.controls.totalPrice.value -
          (this.form.controls.totalPrice.value * (this.form.controls.discount.value / 100)))
      }
      return this.money(this.form.controls.totalPriceAfterDiscount.value)
    } else {
      return this.money(this.form.controls.totalPriceAfterDiscount.value)
    }
  }
}

