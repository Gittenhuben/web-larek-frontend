import './scss/styles.scss';
import { WebLarekAPI } from './components/WebLarekAPI';
import { TItemId, TPaymentType, TItemView, TItemElement } from "./types";
import { API_URL, MODAL_DELAY } from './utils/constants';
import { GalleryView } from './components/View/GalleryView';
import { ItemView } from './components/View/ItemView';
import { ItemsList } from './components/Model/ItemsList';
import { ModalCardPreview } from './components/View/ModalCardPreview';
import { ModalBasket } from './components/View/ModalBasket';
import { ModalOrder } from './components/View/ModalOrder';
import { ModalContacts } from './components/View/ModalContacts';
import { ModalSuccess } from './components/View/ModalSuccess';
import { HeaderBasketView } from './components/View/HeaderBasketView';
import { Basket } from './components/Model/Basket';
import { OrderData } from './components/Model/OrderData';
import { getPriceString } from './utils/utils';
import { EventEmitter } from "./components/base/events";


const cardCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const galleryRoot: HTMLElement = document.querySelector('.gallery');
const headerBasketElement = document.querySelector('.header__basket') as HTMLButtonElement;

const modalRoot: HTMLElement = document.querySelector('#modal-container');
const modalTemplateCardPreview: HTMLTemplateElement = document.querySelector('#card-preview');
const modalTemplateBasket: HTMLTemplateElement = document.querySelector('#basket');
const modalTemplateOrder: HTMLTemplateElement = document.querySelector('#order');
const modalTemplateContacts: HTMLTemplateElement = document.querySelector('#contacts');
const modalTemplateSuccess: HTMLTemplateElement = document.querySelector('#success');

const events = new EventEmitter;
const api = new WebLarekAPI(API_URL);
const itemsList = new ItemsList;
const galleryView = new GalleryView(galleryRoot, events);
const headerBasketView = new HeaderBasketView(headerBasketElement, events);
const basket = new Basket(events);
const orderData = new OrderData();

const modalCardPreview = new ModalCardPreview(modalRoot, modalTemplateCardPreview, events);
const modalBasket = new ModalBasket(modalRoot, modalTemplateBasket, events);
const modalOrder = new ModalOrder(modalRoot, modalTemplateOrder, events);
const modalContacts = new ModalContacts(modalRoot, modalTemplateContacts, events);
const modalSuccess = new ModalSuccess(modalRoot, modalTemplateSuccess, events);


function getItemElements(template: HTMLTemplateElement, items: TItemView[]): TItemElement[] {
  const elementsArray: TItemElement[] = [];
  let i = 1;
  for (const item of items) {
    const itemView = new ItemView(template, item, i++);
    elementsArray.push({id: item.id, element: itemView.get()})
  }
  return elementsArray;
}

events.on('itemList:change', () => {
  galleryView.setItems(getItemElements(cardCatalogTemplate,itemsList.getAllItems()));
  galleryView.render();
})

events.on('gallery:click', (data: {id: TItemId}) => {
  modalCardPreview.setItem(getItemElements(modalTemplateCardPreview, [itemsList.getItem(data.id)])[0], basket.checkItem(data.id));
  modalCardPreview.show();
})

events.on('preview:addToBasket', (data: {id: TItemId}) => {
  basket.addItem(data.id);
  modalCardPreview.hide();
})

events.on('basket:change', () => {
  headerBasketView.counter = basket.getCount();
  modalBasket.setItems(getItemElements(cardBasketTemplate, itemsList.getItems(basket.getItemIds())),
                       basket.getTotalString(itemsList),
                       basket.getCount() > 0 && basket.getTotal(itemsList) !== null
                      );
})

events.on('headerBasket:click', () => {
  modalBasket.show();
})

events.on('basket:deleteItem', (data: {id: TItemId}) => {
  basket.removeItem(data.id);
})

events.on('basket:submit', () => {
  modalBasket.hide();
  orderData.setOrderData({items: basket.getItemIds(), total: basket.getTotal(itemsList)});
  setTimeout(() => {
    modalOrder.show();
  }, MODAL_DELAY);
})

events.on('order:submit', (data: {payment: TPaymentType, address: string}) => {
  modalOrder.hide();
  orderData.setOrderData({payment: data.payment, address: data.address});
  setTimeout(() => {
    modalContacts.show();
  }, MODAL_DELAY);
})

events.on('contacts:submit', (data: {email: string, phone: string}) => {
  modalContacts.hide();
  orderData.setOrderData({email: data.email, phone: data.phone});
  sendOrder();
})

events.on('orderSend:success', (data: {total: number}) => {
  setTimeout(() => {
    modalSuccess.set('Заказ оформлен', 'Списано ' + getPriceString(data.total));
    modalSuccess.show();
  }, MODAL_DELAY);

  basket.reset();
  orderData.setOrderData({items: [], total: 0});
})

events.on('orderSend:error', (data: {error: string}) => {
  setTimeout(() => {
    modalSuccess.set('Ошибка', data.error, true);
    modalSuccess.show();
  }, MODAL_DELAY);
})

events.on('success:submit', (data: {errorMode: boolean}) => {
  modalSuccess.hide();
  if(data.errorMode) sendOrder();
})

function sendOrder(): void {
  api.sendOrder(orderData.getOrderData())
    .then(res => {
      events.emit('orderSend:success', {total: res.total});
    })
    .catch(err => {
      console.log("Ошибка: " + err);
      events.emit('orderSend:error', {error: err});
    })
}

api.getItems()
  .then(res => {
    itemsList.setItems(res.items);
  })
  .catch(err => {
    console.log(`Ошибка загрузки данных с сервера: ${err}`);
  })
  .finally(() => {
    events.emit('itemList:change');
  })
