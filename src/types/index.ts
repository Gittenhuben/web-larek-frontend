export type TItemId = string;

export type TItem = {
  id: TItemId;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export interface IItemsList {
  items: TItem[];
  addItems(items: TItem[]): void;
  getItem(id: TItemId): TItem;
}

export interface IBasket {
  itemIds: TItemId[];
  total: number | null;
  count: number;
  addItem(id: TItemId): void;
  removeItem(id: TItemId): void;
  getItemIds(): TItemId[];
  getTotal(): number | null;
  getCount(): number;
}

export type TOrder = {
  payment: string;
  address: string;
  email: string;
  phone: string;

  itemIds: TItemId[];
  total: number;
}

export interface IOrderData extends TOrder {
  setOrderData(data: TOrder): void;
  getOrderData(): TOrder;
}

export type TOrderResult = {
  result: boolean;
  errorMessage: string;
}

export interface IWebLarekAPI {
  getItems(): Promise<TItem[]>;
  sendOrder(order: TOrder): Promise<TOrderResult>;
}
