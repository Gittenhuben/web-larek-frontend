import { Modal } from './Modal';
import { TItemElement, TItemView } from "../../types";
import { IEvents } from "../base/events";
import { getPriceString } from '../../utils/utils';


export class ModalBasket extends Modal {
  protected items: TItemView[];
  protected templateItemRoot: HTMLElement;
  protected total: HTMLElement;
  protected title: HTMLElement;

  constructor(modalRoot: HTMLElement, templateModal: HTMLTemplateElement, events: IEvents) {
    super(modalRoot, templateModal, events);

    this.container = this.templateModal.content.cloneNode(true) as HTMLElement;
    this.templateItemRoot = this.container.querySelector('.basket__list');
    this.total = this.container.querySelector('.basket__price');
    this.title = this.container.querySelector('.modal__title');
    this.buttonMain = this.container.querySelector('.button');

    this.buttonMain.setAttribute('type', 'button');

    this.buttonMain.addEventListener('click', () => {
      this.events.emit('basket:submit');
    });

    this.title.textContent = 'Корзина пустая';
    this.buttonMain.disabled = true;
    this.total.textContent = getPriceString(0);
  }

  setItems(items: TItemElement[], total: string, buttonEnabled: boolean): void {
    this.removeChildren(this.templateItemRoot);

    if (items.length > 0) {
      let i=1;
      for (const item of items) {
        const buttonDelete = item.element.querySelector('.basket__item-delete');
        buttonDelete.addEventListener('click', () => {
          this.events.emit('basket:deleteItem', {id: item.id});
        });  
        this.templateItemRoot.append(item.element);
      }
      this.title.textContent = 'Корзина';
    } else {
      this.title.textContent = 'Корзина пустая';
    }

    this.total.textContent = total;

    if (!buttonEnabled) {
      this.buttonMain.disabled = true;
    } else {
      this.buttonMain.disabled = false;
    }
  }
}
