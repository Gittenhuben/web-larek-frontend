import { Modal } from './Modal';
import { TItemView } from "../../types";
import { ItemView } from './ItemView';


export class ModalCardPreview extends Modal {
  protected item: TItemView;

  setItem(item: TItemView, inBasket: boolean): void {
    this.item = item;
    const itemView = new ItemView(this.templateModal, item);
    this.container = itemView.get();

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
