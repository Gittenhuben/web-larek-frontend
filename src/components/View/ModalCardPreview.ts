import { Modal } from './Modal';
import { TItemId, TItemView } from "../../types";
import { IEvents } from "../base/events";


export class ModalCardPreview extends Modal {
  protected id: TItemId;
  protected image: HTMLImageElement;
  protected category: HTMLElement;
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected description: HTMLElement;

  constructor(modalRoot: HTMLElement, templateModal: HTMLTemplateElement, events: IEvents) {
    super(modalRoot, templateModal, events);

    this.category = this.container.querySelector('.card__category');
    this.title = this.container.querySelector('.card__title');
    this.image = this.container.querySelector('.card__image');
    this.price = this.container.querySelector('.card__price');
    this.description = this.container.querySelector('.card__text');

    this.buttonMain.addEventListener('click', () => {
      this.events.emit('preview:addToBasket', {id: this.id});
      this.buttonMain.disabled = true;
      this.buttonMain.textContent = 'В корзине';
    });
  }

  setItem(item: TItemView, inBasket: boolean): void {
    this.id = item.id;
    this.image.src = item.imageLink;
    this.category.textContent = item.category;
    this.category.setAttribute('class', 'card__category');
    this.category.classList.add(item.categoryClass);
    this.title.textContent = item.title;
    this.price.textContent = item.priceString;
    this.description.textContent = item.description;

    if (inBasket) {
      this.buttonMain.disabled = true;
      this.buttonMain.textContent = 'В корзине';
    } else {
      this.buttonMain.disabled = false;
      this.buttonMain.textContent = 'В корзину';
    }
  }
}
