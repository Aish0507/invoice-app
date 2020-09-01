import {Product} from './product';
import {Customer} from './customer';


export class Invoice {
    $key: string;
    invnumber: number;
    custumername: string;
    
    // valor total
    amount: number;
    status: string;
    invtotal: number;
    paymenttype: string;
  
    // products: Array<string>;
    // products: string;
    // products: Iproducts;

}

/* export class Iproducts {
    name: string;
    //price: number;
    description:string;
} */

export interface Purchase {
  product: Product;
  quantity: number;
  amount: number;
}

export interface IInvoice {
  $key?: string;
  invoiceNumber?: number;
  createdAt?: string;
  uid?: string;

  custumer: Customer;
  purchases: Purchase[];
  totalPrice: number;

  status?: string;
  paymentType?: string;
}
