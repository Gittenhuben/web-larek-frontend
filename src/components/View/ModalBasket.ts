import { Modal } from './Modal';
import { TItemView } from "../../types";
import { ItemView } from './ItemView';
import { IEvents } from "../base/events";


export class ModalBasket extends Modal {
  protected items: TItemView[];
  protected templateItemRoot: HTMLElement;
  protected templateItem: HTMLTemplateElement;
  protected total: HTMLElement;
  protected title: HTMLElement;

  constructor(modalRoot: HTMLElement, templateModal: HTMLTemplateElement, templateItem: HTMLTemplateElement, events: IEvents) {
    super(modalRoot, templateModal, events);
    this.templateItem = templateItem;
  }

  setItems(items: TItemView[], total: string, buttonEnabled: boolean): void {
    this.container = this.templateModal.content.cloneNode(true) as HTMLElement;
    this.templateItemRoot = this.container.querySelector('.basket__list');
    this.total = this.container.querySelector('.basket__price');
    this.title = this.container.querySelector('.modal__title');
    this.buttonMain = this.container.querySelector('.button');

    this.removeChildren(this.templateItemRoot);
    this.buttonMain.setAttribute('type', 'button');
    
    if (items.length > 0) {
      let i=1;
      for (const item of items) {
        const itemView = new ItemView(this.templateItem, item, i++);
        const itemViewElement = itemView.get();
        const buttonDelete = itemViewElement.querySelector('.basket__item-delete');
        buttonDelete.addEventListener('click', () => {
          this.events.emit('basket:deleteItem', {id: item.id});
        });  
        this.templateItemRoot.append(itemViewElement);
      }
    } else {
      this.title.textContent = 'Корзина пустая';
    }

    this.total.textContent = total;

    if (!buttonEnabled) {
      this.buttonMain.disabled = true;
    } else {
      this.buttonMain.disabled = false;
      this.buttonMain.addEventListener('click', () => {
        this.events.emit('basket:order');
      });
    }
  }
}
