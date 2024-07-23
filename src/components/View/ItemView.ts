import { TItemId, TItemView } from "../../types";

export class ItemView {

  protected container: HTMLElement;

  protected id: TItemId;

  protected category: HTMLElement;
  protected title: HTMLElement;
  protected image: HTMLImageElement;
  protected price: HTMLElement;
  protected description: HTMLElement;
  protected serialNumber: HTMLElement;

  constructor (template: HTMLTemplateElement, item: TItemView, serialNumber: number = 0) {
    this.container = template.content.cloneNode(true) as HTMLElement;

    this.id = item.id;

    this.category = this.container.querySelector('.card__category');
    this.title = this.container.querySelector('.card__title');
    this.image = this.container.querySelector('.card__image');
    this.price = this.container.querySelector('.card__price');
    this.description = this.container.querySelector('.card__text');
    this.serialNumber = this.container.querySelector('.basket__item-index');

    if (this.category) {
      this.category.textContent = item.category;
      this.clearClassListCategories(this.category);
      this.category.classList.add(item.categoryClass);
    }
    if (this.title) this.title.textContent = item.title;
    if (this.image) this.image.src = item.imageLink;
    if (this.price) this.price.textContent = item.priceString;
    if (this.description) this.description.textContent = item.description;
    if (this.serialNumber) this.serialNumber.textContent = String(serialNumber);
  }

  protected clearClassListCategories(elem: HTMLElement): void {
    elem.classList.remove('card__category_soft');
    elem.classList.remove('card__category_additional');
    elem.classList.remove('card__category_button');
    elem.classList.remove('card__category_hard');
    elem.classList.remove('card__category_other');
  }

  get(): HTMLElement {
    return this.container;
  }
}
