import { IEvents } from "../base/events";
import { MODAL_DELAY } from '../../utils/constants';


export abstract class Modal {
  protected modalRoot: HTMLElement;
  protected templateRoot: HTMLElement;
  protected templateModal: HTMLTemplateElement;
  protected container: HTMLElement;
  protected buttonClose: HTMLButtonElement;
  protected events: IEvents;
  protected buttonMain: HTMLButtonElement;
  protected showed: boolean = false;

  constructor(modalRoot: HTMLElement, templateModal: HTMLTemplateElement, events: IEvents) {
    this.container = templateModal.content.cloneNode(true) as HTMLElement;
    this.modalRoot = modalRoot;
    this.templateRoot = this.modalRoot.querySelector('.modal__content');
    this.templateModal = templateModal;
    this.buttonClose = this.modalRoot.querySelector('.modal__close');
    this.events = events;

    document.addEventListener('keydown', this.handleCloseModalByEscapeBinded);
    this.buttonClose.addEventListener('click', this.handleCloseModalByButtonBinded);
    this.modalRoot.addEventListener('mousedown', this.handleCloseModalByOverlayBinded);

    this.container = this.templateModal.content.cloneNode(true) as HTMLElement;
    this.buttonMain = this.container.querySelector('.button:not(.button_alt)');
    this.buttonMain.setAttribute('type', 'button');
  }

  protected removeChildren(elem: HTMLElement): void {
    while (elem.firstChild) elem.lastChild.remove();
  }

  protected moveChildren(source: HTMLElement, destination: HTMLElement): void {
    while (source.firstChild) {
      destination.appendChild(source.lastChild);
    }
  }

  show(): void {
    this.showed = true;
    this.removeChildren(this.templateRoot);
    this.templateRoot.append(this.container);
    this.modalRoot.classList.add('modal_active');
  }

  hide(): void {
    if (this.showed) {
      this.modalRoot.classList.remove('modal_active');
      this.showed = false;
      setTimeout(() => {
        this.moveChildren(this.templateRoot, this.container);
      }, MODAL_DELAY);
    }
  }

  handleCloseModalByEscape(evt: KeyboardEvent): void {
    if (evt.key === 'Escape') this.hide();
  }
  handleCloseModalByEscapeBinded = this.handleCloseModalByEscape.bind(this);

  handleCloseModalByButton(): void {
    this.hide();
  }
  handleCloseModalByButtonBinded = this.handleCloseModalByButton.bind(this);

  handleCloseModalByOverlay(evt: MouseEvent): void {
    if ((<HTMLElement>evt.target).classList.contains('modal_active')) this.hide();
  }
  handleCloseModalByOverlayBinded = this.handleCloseModalByOverlay.bind(this);
}
