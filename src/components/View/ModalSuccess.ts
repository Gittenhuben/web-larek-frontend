import { Modal } from './Modal';
import { IEvents } from "../base/events";


export class ModalSuccess extends Modal {
  protected result: HTMLElement;
  protected description: HTMLElement;
  protected imageContainer: HTMLElement;
  protected errorMode: boolean = false;
  
  constructor(modalRoot: HTMLElement, templateModal: HTMLTemplateElement, events: IEvents) {
    super(modalRoot, templateModal, events);

    this.container = this.templateModal.content.cloneNode(true) as HTMLElement;
    this.result = this.container.querySelector('.order-success__title');
    this.description = this.container.querySelector('.order-success__description');
    this.buttonMain = this.container.querySelector('.button');
    this.imageContainer = this.container.querySelector('.order-success');

    this.buttonMain.setAttribute('type', 'button');

    this.buttonMain.addEventListener('click', () => {
      this.events.emit('success:submit', {errorMode: this.errorMode});
    })
  }

  set(result: string, description: string, errorMode: boolean = false): void {
    this.errorMode = errorMode;
    if (errorMode) {
      this.imageContainer.classList.add('order-error');
      this.buttonMain.textContent = 'Попробовать еще раз';
    } else {
      this.imageContainer.classList.remove('order-error');
      this.buttonMain.textContent = 'За новыми покупками!';
    }

    this.result.textContent = result;
    this.description.textContent = description;
  }
}
