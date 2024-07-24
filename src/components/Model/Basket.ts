import { TItemId, IItemsList, IBasket } from "../../types";
import { IEvents } from "../base/events";
import { getPriceString } from '../../utils/utils';


export class Basket implements IBasket {
  protected itemIds: TItemId[] = [];
  protected total: number | null = 0;
  protected count: number = 0;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  addItem(id: TItemId): void {
    this.itemIds.push(id);
    this.events.emit('basket:change');
  }

  removeItem(id: TItemId): void {
    this.itemIds = this.itemIds.filter(itemId => itemId !== id);
    this.events.emit('basket:change');
  }
  
  reset(): void {
    this.itemIds = [];
    this.events.emit('basket:change');
  }

  getItemIds(): TItemId[] {
    return this.itemIds;
  }

  getTotal(itemsList: IItemsList): number | null {
    let sum: number | null = 0;
    this.itemIds.forEach(itemId => {
      const price = itemsList.getItem(itemId).price;
      if (price !== null && sum !== null) {
        sum += price
      } else {
        sum = null;
      }
    });
    return sum;
  }

  getTotalString(itemsList: IItemsList): string {
    return getPriceString(this.getTotal(itemsList));
  }

  getCount(): number {
    return this.itemIds.length;
  }

  checkItem(itemIdForCheck: TItemId): boolean {
    return this.itemIds.some(itemId => itemId === itemIdForCheck)
  }
}
