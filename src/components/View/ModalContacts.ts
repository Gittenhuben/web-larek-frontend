import { Modal } from './Modal';
import { IEvents } from "../base/events";


export class ModalContacts extends Modal {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;
  protected errors: HTMLElement;

  protected email: string = '';
  protected phone: string = '';

  protected validEmail: boolean = false;
  protected validPhone: boolean = false;
  protected validationActive: boolean = false;

  constructor(modalRoot: HTMLElement, templateModal: HTMLTemplateElement, events: IEvents) {
    super(modalRoot, templateModal, events);

    this.container = this.templateModal.content.cloneNode(true) as HTMLElement;
    this.emailElement = this.container.querySelector('input[name="email"]');
    this.phoneElement = this.container.querySelector('input[name="phone"]');
    this.errors = this.container.querySelector('.form__errors');
    this.buttonMain = this.container.querySelector('.button');
    this.buttonMain.setAttribute('type', 'button');

    this.updateEmailState();
    this.updatePhoneState();
    this.updateMainButtonStatus();
    this.updateErrorText();

    this.emailElement.addEventListener('input', (evt) => {
      this.validEmail = this.emailElement.validity.valid;
      this.email = this.emailElement.value;
      this.updateErrorText();
      this.updateMainButtonStatus();
    });

    this.phoneElement.addEventListener('input', (evt) => {
      this.validPhone = this.phoneElement.validity.valid;
      this.phone = this.phoneElement.value;
      this.updateErrorText();
      this.updateMainButtonStatus();
    });

    this.buttonMain.addEventListener('click', () => {
      this.activateValidation();
      this.updateEmailState();
      this.updatePhoneState();
      this.updateErrorText();
      this.updateMainButtonStatus();
      if (this.validEmail && this.validPhone) {
        this.events.emit('contacts:submit', {email: this.email, phone: this.phone});
      }
    });
  }

  protected activateValidation(): void {
    this.validationActive = true;
    this.emailElement.required = true;
    this.phoneElement.required = true;
  }

  protected updateEmailState(): void {
    this.validEmail = !!this.emailElement.value;
  }

  protected updatePhoneState(): void {
    this.validPhone = !!this.phoneElement.value;
  }

  protected updateErrorText(): void {
    let errorText = '';
    if (this.validationActive) {
      if (!this.validEmail) errorText += 'Не заполнен Email. ';
      if (!this.validPhone) errorText += 'Не заполнен телефон. ';
    }
    this.errors.textContent = errorText;
  }

  protected updateMainButtonStatus(): void {
    this.buttonMain.disabled = !(this.validEmail && this.validPhone) && this.validationActive; 
  }
}
