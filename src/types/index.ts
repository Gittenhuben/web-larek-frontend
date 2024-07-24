export type TItemId = string;

export type TItem = {
  id: TItemId;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export type TItemsAPI = {
  items: TItem[];
  total: number;
}

export type TItemView = TItem & {
  priceString: string;
  imageLink: string;
  categoryClass: string;
}

export interface IItemsList {
  setItems(items: TItem[]): void;
  getAllItems(): TItemView[];
  getItems(itemIds: TItemId[]): TItemView[];
  getItem(id: TItemId): TItemView;
}

export type TItemElement = {
  id: TItemId;
  element: HTMLElement;
}

export interface IBasket {
  addItem(id: TItemId): void;
  removeItem(id: TItemId): void;
  reset(): void;
  getItemIds(): TItemId[];
  getTotal(itemsList: IItemsList): number | null;
  getTotalString(itemsList: IItemsList): string;
  getCount(): number;
  checkItem(itemIdForCheck: TItemId): boolean;
}

export type TPaymentType = 'online' | 'cash';

export type TOrder = {
  payment: TPaymentType;
  address: string;
  email: string;
  phone: string;

  items: TItemId[];
  total: number;
}

export interface IOrderData {
  setOrderData(data: Partial<TOrder>): void;
  getOrderData(): TOrder;
}

export type TOrderResult = {
  id: string;
  total: number;
}

export interface IWebLarekAPI {
  getItems(): Promise<TItemsAPI>;
  sendOrder(order: TOrder): Promise<TOrderResult>;
}
