import { IEvents } from "../base/events";

export class HeaderBasketView {
  protected basketElement: HTMLButtonElement;
  protected counterElement: HTMLElement;
  protected events: IEvents;
  
  constructor(basketElement: HTMLButtonElement, events: IEvents) {
    this.basketElement = basketElement;
    this.counterElement = basketElement.querySelector('.header__basket-counter');
    this.events = events;

    this.basketElement.addEventListener('click', () => {
      this.events.emit('headerBasket:click');
    })
  };

  set counter(itemsCount: number) {
    this.counterElement.textContent = String(itemsCount);
  }
}
