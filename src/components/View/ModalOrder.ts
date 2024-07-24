import { Modal } from './Modal';
import { TPaymentType } from "../../types";
import { IEvents } from "../base/events";


export class ModalOrder extends Modal {
  protected addressElement: HTMLInputElement;
  protected buttonPaymentCard: HTMLButtonElement;
  protected buttonPaymentCash: HTMLButtonElement;
  protected buttonsPayment: HTMLElement;
  protected errors: HTMLElement;

  protected payment: TPaymentType = null;
  protected address: string = '';
  
  protected validAddress: boolean = false;
  protected validPayment: boolean = false;
  protected validationActive: boolean = false;

  constructor(modalRoot: HTMLElement, templateModal: HTMLTemplateElement, events: IEvents) {
    super(modalRoot, templateModal, events);

    this.container = this.templateModal.content.cloneNode(true) as HTMLElement;
    this.addressElement = this.container.querySelector('input[name="address"]');
    this.buttonPaymentCard = this.container.querySelector('button[name="card"]');
    this.buttonPaymentCash = this.container.querySelector('button[name="cash"]');
    this.buttonsPayment = this.container.querySelector('.order__buttons');
    this.errors = this.container.querySelector('.form__errors');
    this.buttonMain = this.container.querySelector('.order__button');
    this.buttonMain.setAttribute('type', 'button');

    this.updatePaymentButtonsState();
    this.updateAddressState();
    this.updateMainButtonStatus();
    this.updateErrorText();

    this.addressElement.addEventListener('input', (evt) => {
      this.validAddress = this.addressElement.validity.valid;
      this.address = this.addressElement.value;
      this.updateErrorText();
      this.updateMainButtonStatus();
    });

    this.buttonPaymentCard.addEventListener('click', () => {
      this.payment = 'online';
      this.updatePaymentButtonsState();
      this.updateErrorText();
      this.updateMainButtonStatus();
    })
  
    this.buttonPaymentCash.addEventListener('click', () => {
      this.payment = 'cash';
      this.updatePaymentButtonsState();
      this.updateErrorText();
      this.updateMainButtonStatus();
    })

    this.buttonMain.addEventListener('click', () => {
      this.activateValidation();
      this.updatePaymentButtonsState();
      this.updateAddressState();
      this.updateErrorText();
      this.updateMainButtonStatus();
      if (this.validPayment && this.validAddress) {
        this.events.emit('order:submit', {payment: this.payment, address: this.address});
      }
    })
  }

  protected activateValidation(): void {
    this.validationActive = true;
    this.addressElement.required = true;
  }

  protected updateAddressState(): void {
    this.validAddress = !!this.addressElement.value;
  }

  protected updatePaymentButtonsState(): void {
    switch(this.payment) {
      case 'online':
        this.buttonPaymentCard.classList.add('button_alt-active');
        this.buttonPaymentCash.classList.remove('button_alt-active');
        this.validPayment = true;
        break;
      case 'cash':
        this.buttonPaymentCard.classList.remove('button_alt-active');
        this.buttonPaymentCash.classList.add('button_alt-active');
        this.validPayment = true;
        break;
      default:
        this.buttonPaymentCard.classList.remove('button_alt-active');
        this.buttonPaymentCash.classList.remove('button_alt-active');
        this.validPayment = false;
        break;
    }
    
    if (this.validationActive) {
      if (!this.validPayment) {
        this.buttonsPayment.classList.add('order__buttons-invalid');
      } else {
        this.buttonsPayment.classList.remove('order__buttons-invalid');
      }
    }
  }

  protected updateErrorText(): void {
    let errorText = '';
    if (this.validationActive) {
      if (!this.validPayment) errorText += 'Не выбран способ оплаты. ';
      if (!this.validAddress) errorText += 'Не заполнен адрес. ';
    }
    this.errors.textContent = errorText;
  }

  protected updateMainButtonStatus(): void {
    this.buttonMain.disabled = !(this.validPayment && this.validAddress) && this.validationActive; 
  }
}
