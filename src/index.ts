import './scss/styles.scss';
import { WebLarekAPI } from './components/WebLarekAPI';
import { TItemId, TPaymentType } from "./types";
import { API_URL, MODAL_DELAY } from './utils/constants';
import { GalleryView } from './components/View/GalleryView';
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
const galleryView = new GalleryView(galleryRoot, cardCatalogTemplate, events);
const headerBasketView = new HeaderBasketView(headerBasketElement, events);
const basket = new Basket(events);
const orderData = new OrderData();

const modalCardPreview = new ModalCardPreview(modalRoot, modalTemplateCardPreview, events);
const modalBasket = new ModalBasket(modalRoot, modalTemplateBasket, cardBasketTemplate, events);
const modalOrder = new ModalOrder(modalRoot, modalTemplateOrder, events);
const modalContacts = new ModalContacts(modalRoot, modalTemplateContacts, events);
const modalSuccess = new ModalSuccess(modalRoot, modalTemplateSuccess, events);


events.on('itemList:change', () => {
  galleryView.setItems(itemsList.getAllItems());
  galleryView.render();
})

events.on('gallery:click', (data: {id: TItemId}) => {
  modalCardPreview.setItem(itemsList.getItem(data.id), basket.checkItem(data.id));
  modalCardPreview.show();
})

events.on('preview:addToBasket', (data: {id: TItemId}) => {
  basket.addItem(data.id);
  modalCardPreview.hide();
})

events.on('basket:change', () => {
  headerBasketView.counter = basket.getCount();
})

events.on('headerBasket:click', () => {
  modalBasket.setItems(itemsList.getItems(basket.getItemIds()),
                       basket.getTotalString(itemsList),
                       basket.getCount() > 0 && basket.getTotal(itemsList) !== null
                      );
  modalBasket.show();
})

events.on('basket:deleteItem', (data: {id: TItemId}) => {
  basket.removeItem(data.id);
  modalBasket.setItems(itemsList.getItems(basket.getItemIds()),
                       basket.getTotalString(itemsList),
                       basket.getCount() > 0 && basket.getTotal(itemsList) !== null
                      );
  modalBasket.show();
})

events.on('basket:order', () => {
  modalBasket.hide();
  orderData.setOrderData({items: basket.getItemIds(), total: basket.getTotal(itemsList)});
  setTimeout(() => {
    modalOrder.init();
    modalOrder.show();
  }, MODAL_DELAY);
})

events.on('order:button', (data: {payment: TPaymentType, address: string}) => {
  modalOrder.hide();
  orderData.setOrderData({payment: data.payment, address: data.address});
  setTimeout(() => {
    modalContacts.init();
    modalContacts.show();
  }, MODAL_DELAY);
})

events.on('contacts:button', (data: {email: string, phone: string}) => {
  modalContacts.hide();
  orderData.setOrderData({email: data.email, phone: data.phone});

  api.sendOrder(orderData.getOrderData())
    .then(res => {
      events.emit('orderSend:success', {total: res.total});
    })
    .catch(err => {
      console.log("Ошибка: " + err);
      events.emit('orderSend:error', {error: err});
    })
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

events.on('success:button', () => {
  modalSuccess.hide();
})


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
