import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-confirmation',
  templateUrl: './invoice-confirmation.component.html',
  styleUrls: ['./invoice-confirmation.component.scss']
})
export class InvoiceConfirmationComponent implements OnInit {

  constructor() { }
  @Input() modalData: any;
  ownerInformation: any
  printBtn: boolean
  ngOnInit(): void {
    this.printBtn = true;
    this.ownerInformation = JSON.parse(localStorage.getItem('currentUser'))
  }
  print() {
    this.printBtn = false;
    setTimeout(() => {
      window.print();
    }, 100);
    setTimeout(() => {
      this.printBtn = true;
    }, 300);
    // window.print();
    // this.printBtn = true;
  }

}
