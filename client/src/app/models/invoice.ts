import { Product } from './product';
import { Customer } from './customer';


export class Invoice {
  id: string;
  sale_info: any;
  time_paid: any;
  time_created: any;
  sale_status_id: any;
  user_id: any;
  with_gst: any;
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
  id?: string;
  invoiceNumber?: number;
  createdAt?: string;
  uid?: string;

  custumer: Customer;
  purchases: Purchase[];
  totalPrice: number;

  status?: string;
  paymentType?: string;
}
