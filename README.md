# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

## Сборка

```
npm run build
```

## Данные и типы данных, используемые в приложении

Идентификатор товара

```
export type TItemId = string;
```

Данные товара

```
export type TItem = {
  id: TItemId;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}
```

Список товаров

```
export interface IItemsList {
  items: TItem[];
  addItems(items: TItem[]): void;
  getItem(id: TItemId): TItem;
}
```

Корзина

```
export interface IBasket {
  itemIds: TItemId[];
  total: number | null;
  count: number;
  addItem(id: TItemId): void;
  removeItem(id: TItemId): void;
  getItemIds(): TItemId[];
  getTotal(): number | null;
  getCount(): number;
}
```

Данные заказа

```
export type TOrder = {
  payment: string;
  address: string;
  email: string;
  phone: string;

  itemIds: TItemId[];
  total: number;
}
```

Интерфейс работы с заказом

```
export interface IOrderData extends TOrder {
  setOrderData(data: TOrder): void;
  getOrderData(): TOrder;
}
```

Результат отправки заказа на сервер

```
export type TOrderResult = {
  result: boolean;
  errorMessage: string;
}
```

Интерфейс API

```
export interface IWebLarekAPI {
  getItems(): Promise<TItem[]>;
  sendOrder(order: TOrder): Promise<TOrderResult>;
}
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт, переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### Класс ItemsList
Класс отвечает за хранение и логику работы с данными товаров.

В полях класса хранятся данные о товарах:
- items: TItem[];

Класс предоставляет набор методов для взаимодействия с этими данными:
- addItems(items: TItem[]): void; - загружает массив товаров в класс
- getItem(id: TItemId): TItem; - возвращает товар по его Id

#### Класс Basket
Класс отвечает за хранение и логику работы с корзиной товаров.

В полях класса хранятся следующие данные:
- itemIds: TItemId[]; - массив id товаров
- total: number | null; - общая стоимость товаров в корзине
- count: number; - количество товаров в корзине

Класс предоставляет набор методов для взаимодействия с этими данными:
- addItem(id: TItemId): void; - добавляет id товара в корзину
- removeItem(id: TItemId): void; - удаляет товар из корзины по id
- getItemIds(): TItemId[]; - возвращает список id товаров в корзине
- getTotal(): number | null; - возвращает общую стоимость товаров в корзине
- getCount(): number; - возвращает количество товаров в корзине

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.

В полях класса хранятся следующие данные:
- payment: string; - способ оплаты
- address: string; - адрес покупателя
- email: string; - электронная почта покупателя
- phone: string; - телефон покупателя
- itemIds: TItemId[]; - список id товаров в заказе
- total: number; - общая стоимость товаров в заказе

Класс предоставляет набор методов для взаимодействия с этими данными:
- setOrderData(data: TOrder): void; - сохраняет данные заказа в классе
- getOrderData(): TOrder; - возвращает данные заказа


### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс ModalView
Реализует модальное окно. Предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, template: string)

Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно, и наименование шаблона из разметки.  
Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.

Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- form: HTMLFormElement - элемент формы
- formName: string - наименование формы
- inputs: NodeListOf\<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record\<string, HTMLElement> - объект хранящий все элементы для вывода ошибок с привязкой к атрибуту name инпутов

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record\<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data: Record\<string, string>): void - принимает объект с данными для заполнения полей формы
- setError(data: { field: string, value: string, validInformation: string }): void - принимает объект с данными для отображения или сокрытия текстов ошибок
- showInputError (errorMessage: string): void - отображает полученный текст ошибки
- hideInputError (): void - очищает текст ошибки
- close (): void - закрывает модальное окно, дополнительно очищая поля формы и деактивируя кнопку сохранения
- get form: HTMLElement - геттер для получения элемента формы

#### Класс ItemView
Отвечает за отображение отдельного товара, задавая все его характеристики. Класс используется для отображения товаров на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки.  
Поля класса содержат элементы разметки параметров товара.

Метод:
- setData(item: TItem): void - заполняет атрибуты элементов карточки товара данными.

#### Класс ItemsContainerView
Отвечает за отображение блока с товарами на главной странице. В конструктор принимает массив с товарами.

#### Класс BasketButtonView
Отвечает за отображение блока с иконкой корзины на главной странице.

Поле:
- count: number - количество товаров в корзине

Метод:
- setCount(count: number) - задает отображаемое количество товаров в корзине


### Слой коммуникации

#### Класс WebLarekAPI
Отвечает за взаимодействие с бэкендом сервиса.

Содержит следующие методы:
- getItems(): Promise\<TItem[]>; - загружает с сервера массив товаров
- sendOrder(order: TOrder): Promise\<TOrderResult>; - отправляет заказ на сервер и получает результат отправки

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой, находится в файле `index.ts`, выполняющем роль презентера. Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`. В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*  

*События изменения данных (генерируются классами моделями данных)*
- `itemsList:changed` - изменение массива товаров

*События коммуникационного слоя*
- `orderStatus:received` - получен результат отправки заказа

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `item:select` - выбор товара для отображения в модальном окне
- `item:add` - добавление товара в корзину
- `basket:open` - открытие модального окна с корзиной
- `item:delete` - выбор товара для удаления из корзины
- `basket:change` - изменение состава корзины

- `address:open` - открытие модального окна с формой ввода способа оплаты и адреса покупателя
- `contacts:open` - открытие модального окна с формой ввода электронной почты и телефона покупателя
- `final:open` - открытие модального окна с результатами отправки заказа на сервер

- `address:input` - изменение данных в форме ввода способа оплаты и адреса покупателя
- `contacts:input` - изменение данных в форме ввода электронной почты и телефона покупателя

- `basket:submit` - нажатие кнопки оформления заказа в корзине
- `address:submit` - сохранение данных в форме ввода способа оплаты и адреса покупателя
- `contacts:submit` - сохранение данных в форме ввода электронной почты и телефона покупателя
- `final:submit` - нажатие кнопки в окне с результатами отправки заказа на сервер

- `basket:validation` - событие, сообщающее о необходимости валидации корзины
- `address:validation` - событие, сообщающее о необходимости валидации формы ввода способа оплаты и адреса покупателя
- `contacts:validation` - событие, сообщающее о необходимости валидации формы ввода электронной почты и телефона покупателя
