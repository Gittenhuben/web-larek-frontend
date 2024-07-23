import { IEvents } from "../base/events";


export abstract class Modal {
  protected modalRoot: HTMLElement;
  protected templateRoot: HTMLElement;
  protected templateModal: HTMLTemplateElement;
  protected container: HTMLElement;
  protected buttonClose: HTMLButtonElement;
  protected events: IEvents;
  protected buttonMain: HTMLButtonElement;

  constructor(modalRoot: HTMLElement, templateModal: HTMLTemplateElement, events: IEvents) {
    this.container = templateModal.content.cloneNode(true) as HTMLElement;
    this.modalRoot = modalRoot;
    this.templateRoot = this.modalRoot.querySelector('.modal__content');
    this.templateModal = templateModal;
    this.buttonClose = this.modalRoot.querySelector('.modal__close');
    this.events = events;

    this.buttonClose.addEventListener('click', () => this.hide());
    this.modalRoot.addEventListener('mousedown', (evt: MouseEvent) => {
      if ((<HTMLElement>evt.target).classList.contains('modal_active')) this.hide();
    });
  }

  protected removeChildren(elem: HTMLElement): void {
    while (elem.firstChild) elem.lastChild.remove();
  }

  show(): void {
    this.removeChildren(this.templateRoot);
    this.templateRoot.append(this.container);
    this.modalRoot.classList.add('modal_active');
    document.addEventListener('keydown', this.handleCloseModalByEscapeBinded);
  }

  hide(): void {
    document.removeEventListener('keydown', this.handleCloseModalByEscapeBinded);
    this.modalRoot.classList.remove('modal_active');
  }

  handleCloseModalByEscape(evt: KeyboardEvent): void {
    if (evt.key === 'Escape') {
      this.hide();
    }
  }
  handleCloseModalByEscapeBinded = this.handleCloseModalByEscape.bind(this);
}
