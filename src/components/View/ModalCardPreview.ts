import { Modal } from './Modal';
import { TItemElement } from "../../types";


export class ModalCardPreview extends Modal {
  protected item: TItemElement;

  setItem(item: TItemElement, inBasket: boolean): void {
    this.item = item;
    this.container = this.item.element;

    this.buttonMain = this.container.querySelector('.card__button');
    this.buttonMain.setAttribute('type', 'button');

    if (inBasket) {
      this.buttonMain.disabled = true;
      this.buttonMain.textContent = 'В корзине';
    } else {
      this.buttonMain.disabled = false;
      this.buttonMain.textContent = 'В корзину';

      this.buttonMain.addEventListener('click', () => {
        this.events.emit('preview:addToBasket', {id: this.item.id});
        this.buttonMain.disabled = true;
        this.buttonMain.textContent = 'В корзине';
      });
    }
  }
}
