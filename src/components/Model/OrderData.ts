import { TItemId, TOrder, TPaymentType, IOrderData } from "../../types";


export class OrderData implements IOrderData {
  protected payment: TPaymentType = null;
  protected address: string = null;
  protected email: string = null;
  protected phone: string = null;
  protected items: TItemId[] = [];
  protected total: number = 0;
  
  setOrderData(data: Partial<TOrder>): void {
    if(data.payment) this.payment = data.payment;
    if(data.address) this.address = data.address;
    if(data.email) this.email = data.email;
    if(data.phone) this.phone = data.phone;
    if(data.items) this.items = data.items;
    if(data.total) this.total = data.total;
  }

  getOrderData(): TOrder {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
      items: this.items,
      total: this.total
    }
  }
}
